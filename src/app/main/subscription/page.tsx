import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Crown, Check } from "lucide-react";

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/index");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      features: ["Create & publish games", "100 Cool Coins start", "Basic Studio tools", "Community access"]
    },
    {
      id: "pro",
      name: "COOLBLOX Pro",
      price: "$9.99/mo",
      features: [
        "Everything in Free",
        "Priority publishing",
        "More collaborators",
        "Bonus Cool Coins monthly",
        "Pro badge on profile",
        "Whop-managed billing"
      ],
      highlight: true
    }
  ];

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <Crown className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-slate-400 mt-2 text-sm">
          Upgrade with Whop. Payments are handled securely by Whop — never stored on COOLBLOX servers.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 ${
              plan.highlight
                ? "bg-cool-600/10 border-cool-500/50"
                : "bg-surface-800 border-slate-700"
            }`}
          >
            <h2 className="text-lg font-bold">{plan.name}</h2>
            <p className="text-3xl font-bold mt-2 mb-4">{plan.price}</p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            {plan.id === "free" ? (
              <div className="w-full py-2.5 rounded-xl bg-surface-900 text-center text-sm text-slate-400">
                Current plan
              </div>
            ) : (
              <a
                href="https://whop.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 rounded-xl bg-cool-600 hover:bg-cool-500 text-center text-sm font-semibold text-white transition"
              >
                Subscribe via Whop
              </a>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-500 mt-8">
        Subscription status is verified server-side. Private API keys are never exposed to the client.
      </p>
    </div>
  );
}
