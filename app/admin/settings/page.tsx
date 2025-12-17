import TwoFactorSetup from "@/components/admin/TwoFactorSetup";

export default function AdminSettings() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-bold text-gray-200 mb-4">Security</h2>
          <TwoFactorSetup />
        </div>
      </div>
    </div>
  );
}