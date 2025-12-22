import { ImageResponse } from 'next/og';
import { supabase } from "@/lib/supabase";

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // 1. Fetch Store and their Products
  // Audit: Ensure your table name is storefront_products
  const { data: store } = await supabase
    .from('stores')
    .select('*, storefront_products(*)') 
    .eq('slug', slug)
    .single();

  if (!store) return new Response("Store not found", { status: 404 });

  // 2. The Empire Design Engine
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          padding: '60px',
        }}
      >
        {/* TOP BAR: StoreLink Branding */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px', width: '100%' }}>
           <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#10b981', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '30px', fontWeight: 'bold' }}>S</span>
              </div>
              <span style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-1px', color: '#111827', marginLeft: '15px' }}>STORELINK</span>
           </div>
           <div style={{ backgroundColor: '#f3f4f6', padding: '10px 25px', borderRadius: '50px', fontSize: '20px', fontWeight: 'bold', color: '#6b7280' }}>
             OFFICIAL VENDOR
           </div>
        </div>

        {/* HERO: Vendor Name */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '60px', width: '100%' }}>
          <h1 style={{ fontSize: '100px', fontWeight: '900', color: '#111827', textTransform: 'uppercase', fontStyle: 'italic', lineHeight: '0.9', margin: 0, letterSpacing: '-4px' }}>
            {store.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '40px', fontWeight: '800', color: '#10b981', letterSpacing: '2px' }}>📍 {store.location || "LAGOS, NIGERIA"}</span>
          </div>
        </div>

        {/* PRODUCT SHOWCASE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
          {store.storefront_products?.slice(0, 2).map((p: any) => (
            <div key={p.id} style={{ display: 'flex', backgroundColor: '#f9fafb', borderRadius: '50px', padding: '30px', border: '2px solid #f3f4f6', alignItems: 'center', width: '100%' }}>
              <img 
                src={p.image_urls?.[0] || p.image_url} 
                style={{ width: '280px', height: '280px', borderRadius: '35px', objectFit: 'cover' }} 
              />
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '40px', flex: 1 }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280', textTransform: 'uppercase', marginBottom: '10px' }}>New Arrival</span>
                <span style={{ fontSize: '45px', fontWeight: '900', color: '#111827', marginBottom: '15px', lineHeight: '1.2' }}>{p.name}</span>
                <span style={{ fontSize: '50px', fontWeight: '900', color: '#10b981' }}>₦{p.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#111827', padding: '50px', borderRadius: '60px', width: '100%' }}>
          <span style={{ color: '#9ca3af', fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>ORDER SECURELY VIA WHATSAPP</span>
          <span style={{ color: '#ffffff', fontSize: '55px', fontWeight: '900' }}>storelink.ng/s/{slug}</span>
          <div style={{ marginTop: '30px', backgroundColor: '#10b981', padding: '15px 40px', borderRadius: '20px', color: 'white', fontSize: '24px', fontWeight: '900' }}>
            VIEW FULL CATALOGUE
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}