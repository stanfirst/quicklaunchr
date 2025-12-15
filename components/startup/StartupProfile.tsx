"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Building2, Calendar, FileText, TrendingUp, Users, DollarSign, Rocket, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import type { BusinessStage, BusinessType } from "@/lib/types/startup";

interface StartupProfileProps {
  startup: any;
}

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
  if (!amount) return "Not specified";
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function StartupProfile({ startup }: StartupProfileProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">{startup.name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="outline" className="text-orange-600 border-orange-600 px-3 py-1">
                {BUSINESS_TYPE_LABELS[startup.business_type] || startup.business_type}
              </Badge>
              <Badge variant="outline" className="text-gray-600 border-gray-600 px-3 py-1">
                {BUSINESS_STAGE_LABELS[startup.stage] || startup.stage}
              </Badge>
              {startup.product_is_live ? (
                <Badge className="bg-green-600 text-white px-3 py-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500 border-gray-500 px-3 py-1">
                  <XCircle className="w-3 h-3 mr-1" />
                  Not Live
                </Badge>
              )}
            </div>
          </div>
          <Link href="/startup/onboarding">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {startup.description}
              </p>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                Business Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue</p>
                  <p className="text-lg font-semibold text-black">
                    {formatCurrency(startup.revenue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Investment Raised</p>
                  <p className="text-lg font-semibold text-black">
                    {formatCurrency(startup.investment_raised)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Valuation</p>
                  <p className="text-lg font-semibold text-black">
                    {formatCurrency(startup.current_valuation)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ask Value</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {formatCurrency(startup.ask_value)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Founders */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black flex items-center">
                <Users className="w-5 h-5 mr-2 text-orange-600" />
                Founders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {startup.founders && startup.founders.length > 0 ? (
                  startup.founders.map((founder: any, index: number) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-black mb-1">
                            {founder.name}
                          </h4>
                          <p className="text-sm text-gray-600">{founder.email}</p>
                        </div>
                        {founder.linkedin && (
                          <a
                            href={founder.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                          >
                            LinkedIn →
                          </a>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Years of Experience</p>
                          <p className="text-sm font-medium text-gray-800">
                            {founder.years_of_experience || 0} years
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Field of Expertise</p>
                          <p className="text-sm font-medium text-gray-800">
                            {founder.field_of_expertise}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No founders added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Information */}
          <Card className="border-2 border-gray-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-orange-600" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Industry</p>
                <p className="text-sm font-medium text-gray-800">{startup.industry}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date of Incorporation</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatDate(startup.date_of_incorporation)}
                </p>
              </div>
              {startup.registration_id && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Registration ID</p>
                  <p className="text-sm font-medium text-gray-800">{startup.registration_id}</p>
                </div>
              )}
              {startup.gst_no && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">GST No.</p>
                  <p className="text-sm font-medium text-gray-800 font-mono">
                    {startup.gst_no}
                  </p>
                </div>
              )}
              {startup.business_pan_number && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">PAN Number</p>
                  <p className="text-sm font-medium text-gray-800 font-mono">
                    {startup.business_pan_number}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-2 border-gray-200 shadow-lg bg-gradient-to-br from-orange-50 to-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-black flex items-center">
                <Rocket className="w-5 h-5 mr-2 text-orange-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Founders</span>
                <span className="text-lg font-bold text-black">
                  {startup.founders?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="text-lg font-bold text-black">
                  {startup.product_is_live ? "Live" : "In Development"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stage</span>
                <span className="text-lg font-bold text-black">
                  {BUSINESS_STAGE_LABELS[startup.stage] || startup.stage}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

