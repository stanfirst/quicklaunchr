import { getAllStartups } from "@/app/actions/startup";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Building2, TrendingUp, Rocket, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const BUSINESS_STAGE_LABELS: Record<string, string> = {
  idea: "Idea",
  mvp: "MVP",
  early_stage: "Early Stage",
  growth: "Growth",
  scaling: "Scaling",
  mature: "Mature",
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  b2b: "B2B",
  b2c: "B2C",
  b2b2c: "B2B2C",
  marketplace: "Marketplace",
  saas: "SaaS",
  ecommerce: "E-commerce",
  fintech: "Fintech",
  healthtech: "Healthtech",
  edtech: "Edtech",
  other: "Other",
};

function formatCurrency(amount: number | null): string {
  if (!amount) return "Not disclosed";
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

function truncateText(text: string | null, maxLength: number = 150): string {
  if (!text) return "No description available";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export default async function StartupsPage() {
  const startups = await getAllStartups();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[96px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Startups
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore innovative startups looking for investment and partnerships
          </p>
        </div>

        {/* Startups Grid */}
        {startups.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No startups found yet
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Be the first to register your startup!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <Link
                key={startup.id}
                href={`/startups/${startup.id}`}
                className="block h-full"
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-orange-500">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                        {startup.name}
                      </CardTitle>
                      <Building2 className="w-5 h-5 text-orange-600 flex-shrink-0 ml-2" />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        {BUSINESS_TYPE_LABELS[startup.business_type] || startup.business_type}
                      </Badge>
                      <Badge variant="outline" className="text-gray-600 border-gray-600">
                        {BUSINESS_STAGE_LABELS[startup.stage] || startup.stage}
                      </Badge>
                      {startup.product_is_live ? (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 border-gray-500">
                          <XCircle className="w-3 h-3 mr-1" />
                          Not Live
                        </Badge>
                      )}
                    </div>
                    {startup.industry && (
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                        {startup.industry}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {truncateText(startup.description)}
                    </p>
                    <div className="space-y-2 mb-4">
                      {startup.current_valuation && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
                          <span className="font-semibold">Valuation:</span>
                          <span className="ml-2">{formatCurrency(startup.current_valuation)}</span>
                        </div>
                      )}
                      {startup.ask_value && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Rocket className="w-4 h-4 mr-2 text-orange-600" />
                          <span className="font-semibold">Seeking:</span>
                          <span className="ml-2">{formatCurrency(startup.ask_value)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-orange-600 font-semibold text-sm mt-4">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

