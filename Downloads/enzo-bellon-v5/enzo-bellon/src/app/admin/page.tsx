'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Client = { id: string; prenom: string; email: string; created_at: string }
type Commande = { id: string; client_prenom: string; client_email: string; client_adresse: string; produits: any; total: number; statut: string; created_at: string }
type Produit = { id: string; name: string; category: string; description: string; price: number; image: string; active: boolean; sizes: string[]; created_at: string }
type SocialStats = { instagram: number; facebook: number }

const categories = ['casquette', 'tshirt', 'sweat', 'ecusson']

type Tab = 'overview' | 'clients' | 'commandes' | 'produits' | 'social' | 'comportement' | 'opportunites' | 'intention'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [produits, setProduits] = useState<Produit[]>([])
  const [search, setSearch] = useState('')
  const [social, setSocial] = useState<SocialStats>({ instagram: 0, facebook: 0 })
  const [editSocial, setEditSocial] = useState(false)
  const [tempSocial, setTempSocial] = useState<SocialStats>({ instagram: 0, facebook: 0 })
  const [savedMsg, setSavedMsg] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', category: 'casquette', description: '', price: '', image: '', sizes: '' })
  const [addMsg, setAddMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [visitorScores, setVisitorScores] = useState<any[]>([])

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
    const { data: ev } = await supabase.from('events').select('*').order('created_at', { ascending: false }).limit(500)
    const { data: sess } = await supabase.from('sessions').select('*').order('started_at', { ascending: false }).limit(100)
    const { data: scores } = await supabase.from('visitor_scores').select('*').order('score', { ascending: false }).limit(50)
    setClients(c || [])
    setCommandes(o || [])
    setProduits(p || [])
    setEvents(ev || [])
    setSessions(sess || [])
    setVisitorScores(scores || [])
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
      sizes: newProduct.sizes ? newProduct.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      active: true,
    }])
    setNewProduct({ name: '', category: 'casquette', description: '', price: '', image: '', sizes: '' })
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

  const navItems: { id: Tab; icon: string; label: string; sublabel: string; badge?: number }[] = [
    { id: 'overview', icon: '📊', label: 'Vue d\'ensemble', sublabel: 'KPI & statistiques' },
    { id: 'clients', icon: '👥', label: 'Clients', sublabel: 'Newsletter & inscrits' },    { id: 'commandes', icon: '🛒', label: 'Commandes', sublabel: 'Suivi & expéditions', badge: commandes.filter(c => c.statut === 'en_attente').length },
    { id: 'produits', icon: '🏷️', label: 'Produits', sublabel: 'Boutique & catalogue' },    { id: 'social', icon: '📱', label: 'Réseaux Sociaux', sublabel: 'Instagram & Facebook' },
    { id: 'comportement', icon: '🧠', label: 'Comportement', sublabel: 'Sessions & parcours' },
    { id: 'opportunites', icon: '💡', label: 'Opportunités', sublabel: 'Détection automatique' },
    { id: 'intention', icon: '🎯', label: 'Intention d\'achat', sublabel: 'Score visiteurs' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: 'white', fontFamily: 'sans-serif', display: 'flex' }}>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '260px' : '64px',
        minHeight: '100vh',
        background: '#0D0D0D',
        borderRight: '1px solid rgba(255,90,0,0.1)',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,90,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '72px' }}>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', letterSpacing: '0.1em' }}>ENZO BELLON</div>
              <div style={{ fontSize: '10px', color: '#FF5A00', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Admin</div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'rgba(255,90,0,0.1)', border: '1px solid rgba(255,90,0,0.2)', color: '#FF5A00', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarOpen ? <path d="M15 18l-6-6 6-6"/> : <path d="M9 18l6-6-6-6"/>}
            </svg>
          </button>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              style={{
                width: '100%',
                padding: sidebarOpen ? '12px 12px' : '12px 0',
                marginBottom: '4px',
                background: tab === item.id ? 'rgba(255,90,0,0.12)' : 'transparent',
                border: tab === item.id ? '1px solid rgba(255,90,0,0.25)' : '1px solid transparent',
                color: tab === item.id ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                position: 'relative',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
              }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: tab === item.id ? 'white' : 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>{item.label}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', marginTop: '1px' }}>{item.sublabel}</div>
                </div>
              )}
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{
                  position: sidebarOpen ? 'relative' : 'absolute',
                  top: sidebarOpen ? 'auto' : '6px',
                  right: sidebarOpen ? 'auto' : '6px',
                  background: '#FF5A00',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 8px', borderTop: '1px solid rgba(255,90,0,0.1)' }}>
          <button onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: 'transparent',
              border: '1px solid rgba(255,50,50,0.2)',
              color: 'rgba(255,100,100,0.6)',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {sidebarOpen && <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>Déconnexion</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 32px', borderBottom: '1px solid rgba(255,90,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0D0D0D' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
              {navItems.find(n => n.id === tab)?.label}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
              {navItems.find(n => n.id === tab)?.sublabel}
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div style={{ padding: '32px', flex: 1 }}>

          {/* VUE D'ENSEMBLE */}
          {tab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {[
                  { label: 'Inscrits newsletter', value: clients.length, icon: '📧', color: '#FF5A00', onClick: () => setTab('clients') },
                  { label: 'Commandes totales', value: commandes.length, icon: '🛒', color: '#FF5A00', onClick: () => setTab('commandes') },
                  { label: "Chiffre d'affaires", value: `${totalCA.toFixed(2)} €`, icon: '💰', color: '#00c864', onClick: () => setTab('commandes') },
                  { label: 'Produits actifs', value: produits.filter(p => p.active).length, icon: '🏷️', color: '#FF5A00', onClick: () => setTab('produits') },
                  { label: 'En attente', value: commandes.filter(c => c.statut === 'en_attente').length, icon: '⏳', color: '#ffaa00', onClick: () => setTab('commandes') },
                  { label: 'Expédiées', value: commandes.filter(c => c.statut === 'expediee').length, icon: '📦', color: '#1877f2', onClick: () => setTab('commandes') },
                ].map(stat => (
                  <div key={stat.label} onClick={stat.onClick}
                    style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,90,0,0.3)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,90,0,0.08)'}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Dernières commandes</div>
                  <button onClick={() => setTab('commandes')} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Voir tout</button>
                </div>
                {commandes.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Aucune commande pour le moment</p>
                ) : commandes.slice(0, 3).map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{c.client_prenom}</div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#FF5A00' }}>{Number(c.total).toFixed(2)} €</span>
                      <span style={{ fontSize: '10px', padding: '3px 8px', background: c.statut === 'livree' ? 'rgba(0,200,100,0.15)' : c.statut === 'expediee' ? 'rgba(255,90,0,0.15)' : 'rgba(255,255,255,0.06)', color: c.statut === 'livree' ? '#00c864' : c.statut === 'expediee' ? '#FF5A00' : 'rgba(255,255,255,0.5)' }}>
                        {c.statut === 'en_attente' ? 'En attente' : c.statut === 'expediee' ? 'Expédiée' : 'Livrée'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Derniers inscrits newsletter</div>
                  <button onClick={() => setTab('clients')} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Voir tout</button>
                </div>
                {clients.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Aucun inscrit pour le moment</p>
                ) : clients.slice(0, 3).map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{c.prenom}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{c.email}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CLIENTS */}
          {tab === 'clients' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input type="text" placeholder="Rechercher un client..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, padding: '10px 16px', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '14px', outline: 'none' }} />
                <button onClick={exportCSV} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#FF3300,#FF5A00)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Exporter CSV
                </button>
              </div>
              <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['Prénom', 'Email', 'Date inscription'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
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
              </div>
            </div>
          )}

          {/* COMMANDES */}
          {tab === 'commandes' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <input type="text" placeholder="Rechercher une commande..." value={search} onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, padding: '10px 16px', background: '#141414', border: '1px solid rgba(255,255,255,0.08)', color: 'white', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredCommandes.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', background: '#141414', border: '1px solid rgba(255,90,0,0.08)' }}>Aucune commande</div>
                ) : filteredCommandes.map((c: any) => (
                  <div key={c.id} style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
                          {c.client_prenom} {c.client_nom || ''}
                          {c.client_entreprise && <span style={{ fontSize: '13px', color: '#FF5A00', marginLeft: '8px' }}>— {c.client_entreprise}</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                          {new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#FF5A00' }}>{Number(c.total).toFixed(2)} €</span>
                        <select value={c.statut} onChange={e => updateStatut(c.id, e.target.value)}
                          style={{ background: '#1E1E1E', border: '1px solid rgba(255,90,0,0.2)', color: 'white', padding: '6px 12px', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                          <option value="en_attente">En attente</option>
                          <option value="expediee">Expédiée</option>
                          <option value="livree">Livrée</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '10px', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Client</div>
                        <div style={{ fontSize: '13px', color: 'white', marginBottom: '4px' }}>📧 {c.client_email}</div>
                        {c.client_telephone && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>📞 {c.client_telephone}</div>}
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                          {c.client_type === 'professionnel' ? '🏢 Professionnel' : '👤 Particulier'}
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '10px', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Adresse livraison</div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>📦 {c.client_adresse || '—'}</div>
                        {c.instructions_livraison && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>💬 {c.instructions_livraison}</div>}
                      </div>
                      {c.client_adresse_facturation && (
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: '10px', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Adresse facturation</div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>🧾 {c.client_adresse_facturation}</div>
                        </div>
                      )}
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '10px', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Produits commandés</div>
                        {Array.isArray(c.produits) ? c.produits.map((p: any, i: number) => (
                          <div key={i} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
                            🏷️ {p.name} × {p.quantity} — {Number(p.price).toFixed(2)} €
                          </div>
                        )) : <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>—</div>}
                      </div>
                    </div>
                    {c.stripe_session_id && (
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '8px' }}>
                        Stripe ID : {c.stripe_session_id}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUITS */}
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
                    <input placeholder="Tailles (ex: S,M,L,XL ou Unique)" value={newProduct.sizes} onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value })}
                      style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', outline: 'none' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', gridColumn: '1 / -1' }}>
                      <input type="file" accept="image/*" id="cloudinary-upload" style={{ display: 'none' }} onChange={handleImageUpload} />
                      <button type="button" onClick={() => document.getElementById('cloudinary-upload')?.click()}
                        style={{ flex: 1, padding: '10px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: uploading ? '#FF5A00' : 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '13px', textAlign: 'left' }}>
                        {uploading ? '⏳ Upload en cours...' : newProduct.image ? '✓ Image uploadée' : '📁 Choisir une image'}
                      </button>
                      {newProduct.image && <img src={newProduct.image} alt="aperçu" style={{ width: '48px', height: '48px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '4px', flexShrink: 0 }} />}
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
                  <thead><tr>{['Produit', 'Catégorie', 'Prix', 'Tailles', 'Statut', 'Actions'].map(h => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {produits.length === 0 ? (
                      <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Aucun produit</td></tr>
                    ) : produits.map((p, i) => (
                      <tr key={p.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                        <td style={td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {p.image && <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: '3px', flexShrink: 0 }} />}
                            <div>
                              <div style={{ fontWeight: 'bold', color: p.active ? 'white' : 'rgba(255,255,255,0.4)' }}>{p.name}</div>
                              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{p.description?.substring(0, 40)}{(p.description?.length || 0) > 40 ? '...' : ''}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ ...td, color: '#FF5A00', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.category}</td>
                        <td style={{ ...td, fontWeight: 'bold', fontSize: '16px' }}>{Number(p.price).toFixed(2)} €</td>
                        <td style={{ ...td, fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                          {p.sizes && p.sizes.length > 0 ? p.sizes.join(', ') : '—'}
                        </td>
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

          {/* RÉSEAUX SOCIAUX */}
          {tab === 'social' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <button onClick={() => { setEditSocial(!editSocial); setTempSocial(social) }}
                  style={{ padding: '10px 24px', background: editSocial ? 'transparent' : 'linear-gradient(135deg,#FF3300,#FF5A00)', border: editSocial ? '1px solid rgba(255,90,0,0.3)' : 'none', color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {editSocial ? 'Annuler' : 'Mettre à jour les chiffres'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: '#141414', border: '1px solid rgba(131,58,180,0.3)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📷</div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Instagram</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>@33fastyfoxy</div>
                    </div>
                    <a href="https://www.instagram.com/33fastyfoxy/" target="_blank" rel="noopener noreferrer"
                      style={{ marginLeft: 'auto', fontSize: '12px', color: '#fd1d1d', textDecoration: 'none', border: '1px solid rgba(253,29,29,0.3)', padding: '6px 14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Ouvrir ↗
                    </a>
                  </div>
                  {editSocial ? (
                    <input type="number" value={tempSocial.instagram} onChange={e => setTempSocial({ ...tempSocial, instagram: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(131,58,180,0.4)', color: 'white', fontSize: '32px', fontWeight: 'bold', outline: 'none', textAlign: 'center' }} />
                  ) : (
                    <div>
                      <div style={{ fontSize: '64px', fontWeight: 'bold', background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>
                        {formatNumber(social.instagram)}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '8px' }}>Abonnés</div>
                    </div>
                  )}
                </div>
                <div style={{ background: '#141414', border: '1px solid rgba(24,119,242,0.3)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #1877f2, #42a5f5)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👥</div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Facebook</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>33fastyfoxy</div>
                    </div>
                    <a href="https://www.facebook.com/33fastyfoxy" target="_blank" rel="noopener noreferrer"
                      style={{ marginLeft: 'auto', fontSize: '12px', color: '#1877f2', textDecoration: 'none', border: '1px solid rgba(24,119,242,0.3)', padding: '6px 14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Ouvrir ↗
                    </a>
                  </div>
                  {editSocial ? (
                    <input type="number" value={tempSocial.facebook} onChange={e => setTempSocial({ ...tempSocial, facebook: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(24,119,242,0.4)', color: 'white', fontSize: '32px', fontWeight: 'bold', outline: 'none', textAlign: 'center' }} />
                  ) : (
                    <div>
                      <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#1877f2', lineHeight: 1 }}>{formatNumber(social.facebook)}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '8px' }}>Abonnés</div>
                    </div>
                  )}
                </div>
              </div>
              {editSocial && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button onClick={saveSocial} style={{ padding: '12px 32px', background: 'linear-gradient(135deg,#FF3300,#FF5A00)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    Sauvegarder
                  </button>
                  {savedMsg && <span style={{ color: '#00c864', fontSize: '13px' }}>✓ Sauvegardé !</span>}
                </div>
              )}
            </div>
          )}

          {/* COMPORTEMENT */}
          {tab === 'comportement' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {[
                  { label: 'Sessions totales', value: sessions.length, icon: '📱' },
                  { label: 'Pages vues', value: events.filter(e => e.type === 'page_view').length, icon: '👁' },
                  { label: 'Vues produits', value: events.filter(e => e.type === 'product_view').length, icon: '🏷️' },
                  { label: 'Ajouts panier', value: events.filter(e => e.type === 'add_to_cart').length, icon: '🛒' },
                  { label: 'Checkout démarrés', value: events.filter(e => e.type === 'checkout_start').length, icon: '💳' },
                  { label: 'Taux conversion', value: sessions.length > 0 ? `${Math.round((sessions.filter(s => s.converted).length / sessions.length) * 100)}%` : '0%', icon: '📈' },
                ].map(stat => (
                  <div key={stat.label} style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF5A00' }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Pages les plus visitées</div>
                  {Object.entries(events.filter(e => e.type === 'page_view').reduce((acc: any, e) => { acc[e.page] = (acc[e.page] || 0) + 1; return acc }, {})).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5).map(([page, count]: any) => (
                    <div key={page} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{page || '/'}</span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#FF5A00' }}>{count} vues</span>
                    </div>
                  ))}
                  {events.filter(e => e.type === 'page_view').length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Aucune donnée encore</p>}
                </div>
                <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Profondeur de scroll</div>
                  {[25, 50, 75, 100].map(depth => {
                    const count = sessions.filter(s => s.scroll_depth >= depth).length
                    const pct = sessions.length > 0 ? Math.round((count / sessions.length) * 100) : 0
                    return (
                      <div key={depth} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Jusqu'à {depth}%</span>
                          <span style={{ fontSize: '12px', color: '#FF5A00' }}>{pct}%</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#FF3300,#FF5A00)', borderRadius: '3px' }} />
                        </div>
                      </div>
                    )
                  })}
                  {sessions.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Aucune donnée encore</p>}
                </div>
                <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '24px', gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Entonnoir de conversion</div>
                  {[
                    { label: 'Visiteurs', type: 'page_view', color: '#1877f2' },
                    { label: 'Vues produits', type: 'product_view', color: '#833ab4' },
                    { label: 'Ajouts panier', type: 'add_to_cart', color: '#ffaa00' },
                    { label: 'Checkout', type: 'checkout_start', color: '#FF5A00' },
                    { label: 'Achats', type: 'purchase', color: '#00c864' },
                  ].map((step, i, arr) => {
                    const count = events.filter(e => e.type === step.type).reduce((acc: string[], e) => acc.includes(e.visitor_id) ? acc : [...acc, e.visitor_id], []).length
                    const maxCount = events.filter(e => e.type === arr[0].type).reduce((acc: string[], e) => acc.includes(e.visitor_id) ? acc : [...acc, e.visitor_id], []).length || 1
                    const barWidth = Math.round((count / maxCount) * 100)
                    return (
                      <div key={step.type} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{step.label}</span>
                          <span style={{ fontSize: '13px', color: step.color }}>{count} visiteurs</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                          <div style={{ height: '100%', width: `${barWidth}%`, background: step.color, borderRadius: '4px', opacity: 0.8 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* OPPORTUNITÉS */}
          {tab === 'opportunites' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {(() => {
                const viewedIds = events.filter(e => e.type === 'product_view').reduce((acc: string[], e) => acc.includes(e.product_id) ? acc : [...acc, e.product_id], [])
                const purchasedNames = commandes.flatMap(c => Array.isArray(c.produits) ? c.produits.map((p: any) => p.name) : [])
                const opps = viewedIds.map((id: any) => {
                  const prod = produits.find(p => p.id === id); if (!prod) return null
                  const views = events.filter(e => e.type === 'product_view' && e.product_id === id).length
                  const purchased = purchasedNames.filter(n => n === prod.name).length
                  return { prod, views, purchased }
                }).filter(Boolean).filter((o: any) => o.views > 1 && o.purchased === 0).sort((a: any, b: any) => b.views - a.views)
                return opps.length > 0 ? opps.slice(0, 4).map((o: any) => (
                  <div key={o.prod.id} style={{ background: '#141414', border: '1px solid rgba(255,170,0,0.2)', padding: '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#ffaa00,#FF5A00)' }} />
                    <div style={{ fontSize: '10px', color: '#ffaa00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>🔥 Produit consulté non acheté</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{o.prod.name}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>{o.views} consultations — 0 achat</div>
                    <div style={{ fontSize: '12px', color: '#ffaa00' }}>💡 Vérifier le prix ou les photos</div>
                  </div>
                )) : (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', background: '#141414', border: '1px solid rgba(255,90,0,0.08)', gridColumn: '1 / -1' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                    <p style={{ fontSize: '13px' }}>Aucune opportunité détectée pour le moment</p>
                    <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '4px' }}>Les données s'accumuleront au fil des visites</p>
                  </div>
                )
              })()}
              {(() => {
                const cartV = events.filter(e => e.type === 'add_to_cart').reduce((acc: string[], e) => acc.includes(e.visitor_id) ? acc : [...acc, e.visitor_id], [])
                const checkV = events.filter(e => e.type === 'checkout_start').reduce((acc: string[], e) => acc.includes(e.visitor_id) ? acc : [...acc, e.visitor_id], [])
                const abandoned = cartV.filter((v: string) => !checkV.includes(v)).length
                return abandoned > 0 ? (
                  <div style={{ background: '#141414', border: '1px solid rgba(255,50,50,0.2)', padding: '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#ff5050,#FF5A00)' }} />
                    <div style={{ fontSize: '10px', color: '#ff5050', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>⚠️ Abandons panier</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{abandoned}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>visiteurs ont ajouté sans commander</div>
                    <div style={{ fontSize: '12px', color: '#ff5050' }}>💡 Envisager un email de relance</div>
                  </div>
                ) : null
              })()}
              {(() => {
                const hot = visitorScores.filter((v: any) => v.level === 'chaud' || v.level === 'acheteur')
                return hot.length > 0 ? (
                  <div style={{ background: '#141414', border: '1px solid rgba(0,200,100,0.2)', padding: '20px', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#00c864,#1877f2)' }} />
                    <div style={{ fontSize: '10px', color: '#00c864', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>🎯 Visiteurs chauds actifs</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{hot.length}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>visiteurs prêts à acheter</div>
                    <div style={{ fontSize: '12px', color: '#00c864' }}>💡 Moment idéal pour une promo flash</div>
                  </div>
                ) : null
              })()}
            </div>
          )}

          {/* INTENTION D'ACHAT */}
          {tab === 'intention' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {[
                  { level: 'froid', label: 'Froid', color: '#1877f2', icon: '🧊' },
                  { level: 'curieux', label: 'Curieux', color: '#833ab4', icon: '👀' },
                  { level: 'engagé', label: 'Engagé', color: '#ffaa00', icon: '🔥' },
                  { level: 'chaud', label: 'Chaud', color: '#FF5A00', icon: '⚡' },
                  { level: 'acheteur', label: 'Acheteur', color: '#00c864', icon: '💳' },
                  { level: 'fidèle', label: 'Fidèle', color: '#fcb045', icon: '⭐' },
                ].map(l => (
                  <div key={l.level} style={{ background: '#141414', border: `1px solid ${l.color}30`, padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{l.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: l.color }}>{visitorScores.filter(v => v.level === l.level).length}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>{l.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '24px', marginBottom: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Calcul du score</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {[
                    { action: 'Page vue', points: '+2', color: '#1877f2' },
                    { action: 'Produit consulté', points: '+10', color: '#833ab4' },
                    { action: 'Ajout au panier', points: '+25', color: '#ffaa00' },
                    { action: 'Checkout démarré', points: '+40', color: '#FF5A00' },
                    { action: 'Achat effectué', points: '+100', color: '#00c864' },
                  ].map(a => (
                    <div key={a.action} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${a.color}20` }}>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{a.action}</span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: a.color }}>{a.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: '#141414', border: '1px solid rgba(255,90,0,0.08)', padding: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '16px' }}>Top visiteurs ({visitorScores.length})</div>
                {visitorScores.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Aucun visiteur tracké pour le moment</p>
                ) : visitorScores.slice(0, 10).map((v, i) => {
                  const lc: any = { froid: '#1877f2', curieux: '#833ab4', engagé: '#ffaa00', chaud: '#FF5A00', acheteur: '#00c864', fidèle: '#fcb045' }
                  const li: any = { froid: '🧊', curieux: '👀', engagé: '🔥', chaud: '⚡', acheteur: '💳', fidèle: '⭐' }
                  return (
                    <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', width: '20px' }}>#{i + 1}</span>
                      <span style={{ fontSize: '16px' }}>{li[v.level] || '👤'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{v.visitor_id.substring(0, 20)}...</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '2px' }}>Dernière visite : {new Date(v.last_seen).toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: lc[v.level] || '#FF5A00' }}>{v.score}</div>
                        <div style={{ fontSize: '10px', color: lc[v.level] || '#FF5A00', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{v.level}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}