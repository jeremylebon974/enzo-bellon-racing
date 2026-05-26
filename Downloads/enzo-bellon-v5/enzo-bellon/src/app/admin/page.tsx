'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Client = { id: string; prenom: string; email: string; created_at: string }
type Commande = { id: string; client_prenom: string; client_email: string; produits: any; total: number; statut: string; created_at: string }
type Produit = { id: string; name: string; category: string; description: string; price: number; image: string; active: boolean; created_at: string }
type SocialStats = { instagram: number; facebook: number }

const categories = ['casquette', 'tshirt', 'sweat', 'ecusson']

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'clients' | 'commandes' | 'produits'>('clients')
  const [clients, setClients] = useState<Client[]>([])
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [search, setSearch] = useState('')
  const [social, setSocial] = useState<SocialStats>({ instagram: 0, facebook: 0 })
  const [editSocial, setEditSocial] = useState(false)
  const [tempSocial, setTempSocial] = useState<SocialStats>({ instagram: 0, facebook: 0 })
  const [savedMsg, setSavedMsg] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', category: 'casquette', description: '', price: '', image: '' })
  const [addMsg, setAddMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/admin/login'); return }
      await loadData()
      const saved = localStorage.getItem('eb_social_stats')
      if (saved) { const p = JSON.parse(saved); setSocial(p); setTempSocial(p) }
      setLoading(false)
    }
    check()
  }, [])

  const loadData = async () => {
    const { data: c } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    const { data: o } = await supabase.from('commandes').select('*').order('created_at', { ascending: false })
    const { data: p } = await supabase.from('produits').select('*').order('created_at', { ascending: false })
    setClients(c || [])
    setCommandes(o || [])
    setProduits(p || [])
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const exportCSV = () => {
    const rows = [['Prénom', 'Email', 'Date'], ...clients.map(c => [c.prenom, c.email, new Date(c.created_at).toLocaleDateString('fr-FR')])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'clients.csv'; a.click()
  }

  const updateStatut = async (id: string, statut: string) => {
    await supabase.from('commandes').update({ statut }).eq('id', id)
    await loadData()
  }

  const saveSocial = () => {
    setSocial(tempSocial)
    localStorage.setItem('eb_social_stats', JSON.stringify(tempSocial))
    setEditSocial(false)
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  const toggleProduit = async (id: string, active: boolean) => {
    await supabase.from('produits').update({ active: !active }).eq('id', id)
    await loadData()
  }

  const deleteProduit = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('produits').delete().eq('id', id)
    await loadData()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'enzobellon')
    const res = await fetch('https://api.cloudinary.com/v1_1/drcipztzo/image/upload', { method: 'POST', body: formData })
    const data = await res.json()
    setNewProduct(prev => ({ ...prev, image: data.secure_url }))
    setUploading(false)
  }

  const addProduit = async () => {
    if (!newProduct.name || !newProduct.price) { setAddMsg('Nom et prix obligatoires.'); return }
    await supabase.from('produits').insert([{
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      image: newProduct.image,
      active: true,
    }])
    setNewProduct({ name: '', category: 'casquette', description: '', price: '', image: '' })
    setShowAddProduct(false)
    setAddMsg('Produit ajouté !')
    setTimeout(() => setAddMsg(''), 2000)
    await loadData()
  }

  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return n > 0 ? n.toString() : '—'
  }

  const totalCA = commandes.reduce((sum, c) => sum + Number(c.total), 0)
  const filteredClients = clients.filter(c => c.prenom.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  const filteredCommandes = commandes.filter(c => c.client_email.toLowerCase().includes(search.toLowerCase()) || c.client_prenom.toLowerCase().includes(search.toLowerCase()))

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <p style={{ color: '#FF5A00', fontSize: '24px', fontWeight: 'bold' }}>CHARGEMENT...</p>
    </div>
  )

  const th: React.CSSProperties = { textAlign: 'left', padding: '12px 20px', fontSize: '11px', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid rgba(255,90,0,0.1)' }
  const td: React.CSSProperties = { padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '14px' }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: 'white', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0A0A0A', borderBottom: '1px solid rgba(255,90,0,0.15)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>ENZO BELLON</div>
          <div style={{ fontSize: '11px', color: '#FF5A00', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Admin Dashboard</div>
        </div>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,90,0,0.3)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Déconnexion</button>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Inscrits newsletter', value: clients.length, icon: '📧' },
            { label: 'Commandes', value: commandes.length, icon: '🛒' },
            { label: "Chiffre d'affaires", value: `${totalCA.toFixed(2)} €`, icon: '💰' },
            { label: 'Produits actifs', value: produits.filter(p => p.active).length, icon: '🏷️' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.1)', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF5A00' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Réseaux sociaux */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Réseaux Sociaux</div>
            <button onClick={() => { setEditSocial(!editSocial); setTempSocial(social) }}
              style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(255,90,0,0.3)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {editSocial ? 'Annuler' : 'Mettre à jour'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: '#141414', border: '1px solid rgba(131,58,180,0.3)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📷</div>
                <div><div style={{ fontWeight: 'bold', fontSize: '14px' }}>Instagram</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>@33fastyfoxy</div></div>
                <a href="https://www.instagram.com/33fastyfoxy/" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: '11px', color: '#fd1d1d', textDecoration: 'none', border: '1px solid rgba(253,29,29,0.3)', padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ouvrir</a>
              </div>
              {editSocial ? (
                <input type="number" value={tempSocial.instagram} onChange={e => setTempSocial({ ...tempSocial, instagram: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(131,58,180,0.4)', color: 'white', fontSize: '24px', fontWeight: 'bold', outline: 'none', textAlign: 'center' }} />
              ) : (
                <div>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{formatNumber(social.instagram)}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Abonnés</div>
                </div>
              )}
            </div>
            <div style={{ background: '#141414', border: '1px solid rgba(24,119,242,0.3)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #1877f2, #42a5f5)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👥</div>
                <div><div style={{ fontWeight: 'bold', fontSize: '14px' }}>Facebook</div><div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>33fastyfoxy</div></div>
                <a href="https://www.facebook.com/33fastyfoxy" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: '11px', color: '#1877f2', textDecoration: 'none', border: '1px solid rgba(24,119,242,0.3)', padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ouvrir</a>
              </div>
              {editSocial ? (
                <input type="number" value={tempSocial.facebook} onChange={e => setTempSocial({ ...tempSocial, facebook: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(24,119,242,0.4)', color: 'white', fontSize: '24px', fontWeight: 'bold', outline: 'none', textAlign: 'center' }} />
              ) : (
                <div>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1877f2' }}>{formatNumber(social.facebook)}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>Abonnés</div>
                </div>
              )}
            </div>
          </div>
          {editSocial && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={saveSocial} style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#FF3300,#FF5A00)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Sauvegarder</button>
              {savedMsg && <span style={{ color: '#00c864', fontSize: '13px' }}>✓ Sauvegardé</span>}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['clients', 'commandes', 'produits'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '10px 24px', background: tab === t ? 'linear-gradient(135deg,#FF3300,#FF5A00)' : 'transparent', color: tab === t ? 'white' : 'rgba(255,255,255,0.4)', border: tab === t ? 'none' : '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {t === 'clients' ? `Clients (${clients.length})` : t === 'commandes' ? `Commandes (${commandes.length})` : `Produits (${produits.length})`}
            </button>
          ))}
        </div>

        {/* Onglet Produits */}
        {tab === 'produits' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{produits.filter(p => p.active).length} actifs — {produits.filter(p => !p.active).length} désactivés</div>
              <button onClick={() => setShowAddProduct(!showAddProduct)}
                style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#FF3300,#FF5A00)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {showAddProduct ? 'Annuler' : '+ Ajouter un produit'}
              </button>
            </div>
            {addMsg && <p style={{ color: addMsg.includes('ajouté') ? '#00c864' : '#FF5A00', fontSize: '12px', marginBottom: '12px' }}>{addMsg}</p>}
            {showAddProduct && (
              <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.2)', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Nouveau produit</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input placeholder="Nom du produit *" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none' }} />
                  <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ padding: '10px 14px', background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', cursor: 'pointer' }}>
                    {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                  <input placeholder="Prix (ex: 49.90) *" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none' }} />

                  {/* Upload image Cloudinary */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="file" accept="image/*" id="cloudinary-upload" style={{ display: 'none' }} onChange={handleImageUpload} />
                    <button type="button" onClick={() => document.getElementById('cloudinary-upload')?.click()}
                      style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: uploading ? '#FF5A00' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}>
                      {uploading ? '⏳ Upload en cours...' : newProduct.image ? '✓ Image uploadée' : '📁 Choisir une image'}
                    </button>
                    {newProduct.image && (
                      <img src={newProduct.image} alt="aperçu" style={{ width: '48px', height: '48px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '4px', flexShrink: 0 }} />
                    )}
                  </div>
                </div>
                <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none', marginBottom: '12px', minHeight: '80px', resize: 'vertical' }} />
                <button onClick={addProduit}
                  style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#FF3300,#FF5A00)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  Ajouter le produit
                </button>
              </div>
            )}
            <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['Produit', 'Catégorie', 'Prix', 'Statut', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                <tbody>
                  {produits.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Aucun produit — cliquez sur "+ Ajouter un produit"</td></tr>
                  ) : produits.map((p, i) => (
                    <tr key={p.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {p.image && <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '3px', flexShrink: 0 }} />}
                          <div>
                            <div style={{ fontWeight: 'bold', color: p.active ? 'white' : 'rgba(255,255,255,0.4)' }}>{p.name}</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{p.description?.substring(0, 50)}{(p.description?.length || 0) > 50 ? '...' : ''}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...td, color: '#FF5A00', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.category}</td>
                      <td style={{ ...td, fontWeight: 'bold', fontSize: '16px' }}>{Number(p.price).toFixed(2)} €</td>
                      <td style={td}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', background: p.active ? 'rgba(0,200,100,0.15)' : 'rgba(255,255,255,0.06)', color: p.active ? '#00c864' : 'rgba(255,255,255,0.4)', border: `1px solid ${p.active ? 'rgba(0,200,100,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                          {p.active ? 'Actif' : 'Désactivé'}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => toggleProduit(p.id, p.active)}
                            style={{ padding: '4px 12px', background: p.active ? 'rgba(255,255,255,0.06)' : 'rgba(0,200,100,0.1)', border: `1px solid ${p.active ? 'rgba(255,255,255,0.1)' : 'rgba(0,200,100,0.3)'}`, color: p.active ? 'rgba(255,255,255,0.5)' : '#00c864', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {p.active ? 'Désactiver' : 'Activer'}
                          </button>
                          <button onClick={() => deleteProduit(p.id)}
                            style={{ padding: '4px 12px', background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.2)', color: 'rgba(255,100,100,0.7)', cursor: 'pointer', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clients & Commandes */}
        {tab !== 'produits' && (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, padding: '10px 16px', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '14px', outline: 'none' }} />
              {tab === 'clients' && (
                <button onClick={exportCSV} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#FF3300,#FF5A00)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Exporter CSV
                </button>
              )}
            </div>
            <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', overflowX: 'auto' }}>
              {tab === 'clients' ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Prénom', 'Email', 'Date'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Aucun client inscrit</td></tr>
                    ) : filteredClients.map((c, i) => (
                      <tr key={c.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={{ ...td, fontWeight: 'bold' }}>{c.prenom}</td>
                        <td style={{ ...td, color: 'rgba(255,255,255,0.6)' }}>{c.email}</td>
                        <td style={{ ...td, color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Client', 'Produits', 'Total', 'Statut', 'Date', 'Action'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredCommandes.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Aucune commande</td></tr>
                    ) : filteredCommandes.map((c, i) => (
                      <tr key={c.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={td}><div style={{ fontWeight: 'bold' }}>{c.client_prenom}</div><div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{c.client_email}</div></td>
                        <td style={{ ...td, color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>{Array.isArray(c.produits) ? c.produits.map((p: any) => p.name).join(', ') : '-'}</td>
                        <td style={{ ...td, color: '#FF5A00', fontWeight: 'bold', fontSize: '18px' }}>{Number(c.total).toFixed(2)} €</td>
                        <td style={td}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', background: c.statut === 'livree' ? 'rgba(0,200,100,0.15)' : c.statut === 'expediee' ? 'rgba(255,90,0,0.15)' : 'rgba(255,255,255,0.06)', color: c.statut === 'livree' ? '#00c864' : c.statut === 'expediee' ? '#FF5A00' : 'rgba(255,255,255,0.5)' }}>
                            {c.statut === 'en_attente' ? 'En attente' : c.statut === 'expediee' ? 'Expédiée' : 'Livrée'}
                          </span>
                        </td>
                        <td style={{ ...td, color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                        <td style={td}>
                          <select value={c.statut} onChange={e => updateStatut(c.id, e.target.value)}
                            style={{ background: '#1E1E1E', border: '1px solid rgba(255,90,0,0.2)', color: 'white', padding: '4px 8px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                            <option value="en_attente">En attente</option>
                            <option value="expediee">Expédiée</option>
                            <option value="livree">Livrée</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}