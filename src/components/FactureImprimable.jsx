import { montantEnLettres } from '../utils/montantEnLettres';
import { numeroFacture } from '../utils/format';

const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('fr-FR');

const dateFacture = (valeur) =>
  new Date(valeur || Date.now()).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

// Mise en page de la facture imprimée, d'après le modèle validé.
// Les coordonnées viennent de « Mon profil » ; le numéro, la date et le total sont calculés.
export default function FactureImprimable({ facture, lignes: lignesRecues, entreprise, titre = 'FACTURE', avecSignatureClient = false }) {
  // Anciennes factures sans lignes détaillées : on affiche une ligne à partir du libellé et du montant enregistrés
  const lignes = lignesRecues.length > 0
    ? lignesRecues
    : [{ designation: facture.service || 'Prestation', quantity: 1, unit_price: facture.amount }];
  const total = lignes.reduce((s, l) => s + Number(l.total_price ?? Number(l.quantity) * Number(l.unit_price)), 0);
  // Seules les lignes réelles sont affichées : pas de lignes vides ajoutées, pour tenir sur une page
  const lignesAffichees = lignes;
  const ville = (entreprise.company_location || '').split(',')[0] || 'Yaoundé';
  const enTete = { fontFamily: "'Segoe UI', system-ui, sans-serif" };

  return (
    <div style={{ width: 794, boxSizing: 'border-box', padding: '20px 44px 24px', display: 'flex', flexDirection: 'column', background: '#fff', color: '#111827', fontFamily: "'Times New Roman', Georgia, serif", lineHeight: 1.2 }}>
      {/* En-tête du papier à en-tête, avec le numéro de contribuable et la boîte postale juste en dessous */}
      <img src="/entete-rbc.jpg" alt="Rodrigue'z Business Center" style={{ width: '100%', display: 'block' }} />
      <div style={{ ...enTete, textAlign: 'center', fontSize: 12, color: '#111827', marginTop: 6 }}>
        BP : 8718 Yaoundé 14 &nbsp;·&nbsp; N° Cont. P038200491062U
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, fontSize: 14 }}>
        {ville}, le <span style={{ marginLeft: 6, fontWeight: 600 }}>{dateFacture(facture.created_at)}</span>
      </div>

      <h1 style={{ margin: '12px 0 0', textAlign: 'center', fontSize: 19, textDecoration: 'underline', letterSpacing: 1 }}>
        {titre} N° {numeroFacture(facture)}
      </h1>

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <span style={{ fontWeight: 700, textDecoration: 'underline' }}>Doit :</span>
        <span style={{ marginLeft: 8, fontWeight: 700 }}>{facture.client}</span>
        {facture.client_phone && (
          <div style={{ marginLeft: 8, fontSize: 13, marginTop: 2 }}>Tél. : {facture.client_phone}</div>
        )}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#1e6fd9', color: '#fff' }}>
            <th style={{ ...enTete, border: '1px solid #1e6fd9', padding: '4px 8px', textAlign: 'center', fontSize: 12 }}>DÉSIGNATION</th>
            <th style={{ ...enTete, border: '1px solid #1e6fd9', padding: '4px 8px', width: 70, textAlign: 'center', fontSize: 12 }}>QTÉ</th>
            <th style={{ ...enTete, border: '1px solid #1e6fd9', padding: '4px 8px', width: 110, textAlign: 'center', fontSize: 12 }}>P.U</th>
            <th style={{ ...enTete, border: '1px solid #1e6fd9', padding: '4px 8px', width: 120, textAlign: 'center', fontSize: 12 }}>P.T</th>
          </tr>
        </thead>
        <tbody>
          {lignesAffichees.map((l, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #9ca3af', padding: '3px 8px', textAlign: 'center' }}>{l?.designation || ''}</td>
              <td style={{ border: '1px solid #9ca3af', padding: '3px 8px', textAlign: 'center' }}>{l ? l.quantity : ''}</td>
              <td style={{ border: '1px solid #9ca3af', padding: '3px 8px', textAlign: 'center' }}>{l ? fmt(l.unit_price) : ''}</td>
              <td style={{ border: '1px solid #9ca3af', padding: '3px 8px', textAlign: 'center' }}>
                {l ? fmt(l.total_price ?? Number(l.quantity) * Number(l.unit_price)) : ''}
              </td>
            </tr>
          ))}
          <tr style={{ background: '#dbeafe', fontWeight: 700 }}>
            <td colSpan={3} style={{ ...enTete, border: '1px solid #1e6fd9', padding: '3px 8px', textAlign: 'center' }}>TOTAL</td>
            <td style={{ border: '1px solid #1e6fd9', padding: '3px 8px', textAlign: 'center' }}>{fmt(total)}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ margin: '10px 0 0', fontSize: 13, lineHeight: 1.3 }}>
        Arrêté la présente facture à la somme de :{' '}
        <span style={{ fontWeight: 700 }}>{montantEnLettres(total)} francs CFA.</span>
      </p>


    </div>
  );
}
