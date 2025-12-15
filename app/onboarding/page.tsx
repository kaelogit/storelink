"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Store, MapPin, Phone } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "Fashion", // Default
    location: "Lagos",
    whatsapp: "",
    description: ""
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      setUser(user);
    };
    checkUser();
  }, [router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(""); // Clear previous errors

    if (!user) return;

    const { error } = await supabase.from("stores").insert({
      owner_id: user.id,
      name: formData.name,
      slug: formData.slug,
      category: formData.category,
      location: formData.location,
      whatsapp_number: formData.whatsapp,
      description: formData.description,
      subscription_plan: 'free'
    });

    if (error) {
      setErrorMsg(error.message); // Save the error to state
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden">
        
        <div className="bg-gray-900 p-6 text-white text-center">
          <Store className="w-12 h-12 mx-auto mb-3 opacity-80" />
          <h1 className="text-2xl font-bold">Setup Your Store</h1>
          <p className="text-gray-400 text-sm">One last step to start selling.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Store Name</label>
            <input 
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g. Mira's Perfume"
              value={formData.name}
              onChange={handleNameChange}
            />
            <p className="text-xs text-gray-400 mt-1">
              Your link: storelink.ng/<span className="font-bold text-gray-600">{formData.slug || "your-store"}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
               <select 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="" disabled>Select a Category</option>
                  
                  <optgroup label="Popular">
                    <option>Fashion & Clothing</option>
                    <option>Beauty & Skincare</option>
                    <option>Food & Groceries</option>
                    <option>Electronics & Gadgets</option>
                  </optgroup>

                  <optgroup label="Lifestyle & Home">
                    <option>Home & Kitchen</option>
                    <option>Furniture & Decor</option>
                    <option>Kids & Babies</option>
                    <option>Health & Wellness</option>
                    <option>Pets & Supplies</option>
                  </optgroup>

                  <optgroup label="Services & Digital">
                    <option>Digital Services</option>
                    <option>Education & Books</option>
                    <option>Events & Party</option>
                    <option>Automotive</option>
                    <option>Real Estate</option>
                  </optgroup>

                  <optgroup label="Others">
                    <option>Art & Crafts</option>
                    <option>Sports & Outdoors</option>
                    <option>Other</option>
                  </optgroup>
                </select>
             </div>
             
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
               <div className="relative">
                 <MapPin className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                 <input 
                   required
                   className="w-full p-3 pl-9 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                   placeholder="Lagos"
                   value={formData.location}
                   onChange={e => setFormData({...formData, location: e.target.value})}
                 />
               </div>
             </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
              <input 
                required
                type="tel"
                className="w-full p-3 pl-9 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="08012345678"
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Orders will be sent here.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Short Bio</label>
            <textarea 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 h-24 resize-none"
              placeholder="Tell customers what you sell..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg text-center border border-red-100">
              ⚠️ {errorMsg}
            </div>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Launch Store 🚀"}
          </button>

        </form>
      </div>
    </div>
  );
}