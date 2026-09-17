'use client';

export default function VariantEditor({ variants, onChange }) {
  function updateVariant(index, patch) {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function addVariant() {
    onChange([...variants, { label: '', price: '' }]);
  }

  function removeVariant(index) {
    onChange(variants.filter((_, i) => i !== index));
  }

  return (
    <div style={{ border: '1px solid var(--gray-light)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--green-dark)', display: 'block', marginBottom: 8 }}>
        Size / Price Options
      </label>
      {variants.map((v, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
          <input
            type="text" placeholder="e.g. 1kg, Medium, Slice" value={v.label}
            onChange={(e) => updateVariant(i, { label: e.target.value })}
            style={{ flex: 1, padding: '8px 10px', border: '1px solid var(--gray-light)', borderRadius: 6 }}
          />
          <input
            type="number" min="0" placeholder="Price (UGX)" value={v.price}
            onChange={(e) => updateVariant(i, { price: e.target.value })}
            style={{ width: 130, padding: '8px 10px', border: '1px solid var(--gray-light)', borderRadius: 6 }}
          />
          <button type="button" className="btn-danger" onClick={() => removeVariant(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="btn-sm-outline" onClick={addVariant}>+ Add Size / Price</button>
    </div>
  );
}
