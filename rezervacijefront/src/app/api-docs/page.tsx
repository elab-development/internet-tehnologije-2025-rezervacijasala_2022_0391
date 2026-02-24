"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import spec from "@/swagger.json";

// Koristimo dynamic import jer SwaggerUI ne radi najbolje sa Server-side renderingom
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="p-4 bg-gray-100 border-b">
        <h1 className="text-xl font-bold text-center text-gray-800 uppercase tracking-widest">
          API Dokumentacija sistema
        </h1>
      </div>
      <SwaggerUI spec={spec} />
    </div>
  );
}