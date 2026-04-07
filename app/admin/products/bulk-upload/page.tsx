'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface UploadResult {
  row: number;
  product: string;
  status: string;
  error?: string;
}

interface UploadResponse {
  message: string;
  created: number;
  updated: number;
  errors: number;
  variantsProcessed: number;
  results: UploadResult[];
}

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<UploadResponse | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setResponse(null);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/products/bulk-upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Upload failed');
    } else {
      setResponse(data);
    }
    setUploading(false);
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'created': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'updated': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'skipped': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default: return null;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'created': return 'text-green-400';
      case 'updated': return 'text-blue-400';
      case 'error': return 'text-red-400';
      case 'skipped': return 'text-amber-400';
      default: return 'text-[#F0E6C2]/50';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cormorant text-white text-3xl font-medium">Bulk Product Upload</h1>
          <p className="font-montserrat text-[#F0E6C2]/40 text-xs mt-1">Upload products from an Excel spreadsheet</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/api/admin/products/bulk-upload"
            className="flex items-center gap-2 bg-[#BFA06A]/20 border border-[#BFA06A]/40 text-[#BFA06A] font-montserrat text-xs tracking-[0.15em] uppercase px-4 py-2 font-semibold hover:bg-[#BFA06A]/30 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download Template
          </a>
          <Link
            href="/admin/products"
            className="border border-[#BFA06A]/10 text-[#F0E6C2]/50 font-montserrat text-xs tracking-[0.15em] uppercase px-4 py-2 hover:text-[#F0E6C2] hover:border-[#BFA06A]/30 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-8 mb-8">
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[#BFA06A]/20 hover:border-[#BFA06A]/50 rounded p-12 text-center cursor-pointer transition-colors"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => { setFile(e.target.files?.[0] || null); setResponse(null); setError(''); }}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileSpreadsheet className="w-8 h-8 text-green-400" />
              <div className="text-left">
                <p className="font-montserrat text-[#F0E6C2] text-sm">{file.name}</p>
                <p className="font-montserrat text-[#F0E6C2]/40 text-xs">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="w-10 h-10 text-[#BFA06A]/40 mx-auto mb-4" />
              <p className="font-montserrat text-[#F0E6C2]/60 text-sm mb-1">Click to select Excel file</p>
              <p className="font-montserrat text-[#F0E6C2]/30 text-xs">.xlsx or .xls · Download the template first</p>
            </div>
          )}
        </div>

        {file && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-[#BFA06A] text-black font-montserrat text-xs tracking-[0.2em] uppercase px-8 py-3 font-bold hover:bg-[#D4B580] transition-colors cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'Uploading & Processing...' : 'Upload & Import Products'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-montserrat text-sm px-6 py-4 mb-8">
          {error}
        </div>
      )}

      {/* Results */}
      {response && (
        <div>
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0A0A0A] border border-green-400/20 p-5 rounded text-center">
              <p className="font-cormorant text-green-400 text-3xl font-medium">{response.created}</p>
              <p className="font-montserrat text-green-400/60 text-[0.6rem] tracking-[0.2em] uppercase mt-1">Created</p>
            </div>
            <div className="bg-[#0A0A0A] border border-blue-400/20 p-5 rounded text-center">
              <p className="font-cormorant text-blue-400 text-3xl font-medium">{response.updated}</p>
              <p className="font-montserrat text-blue-400/60 text-[0.6rem] tracking-[0.2em] uppercase mt-1">Updated</p>
            </div>
            <div className="bg-[#0A0A0A] border border-red-400/20 p-5 rounded text-center">
              <p className="font-cormorant text-red-400 text-3xl font-medium">{response.errors}</p>
              <p className="font-montserrat text-red-400/60 text-[0.6rem] tracking-[0.2em] uppercase mt-1">Errors</p>
            </div>
            <div className="bg-[#0A0A0A] border border-purple-400/20 p-5 rounded text-center">
              <p className="font-cormorant text-purple-400 text-3xl font-medium">{response.variantsProcessed}</p>
              <p className="font-montserrat text-purple-400/60 text-[0.6rem] tracking-[0.2em] uppercase mt-1">Extra Variants</p>
            </div>
          </div>

          {/* Detail Table */}
          <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded overflow-hidden">
            <div className="px-6 py-4 border-b border-[#BFA06A]/10">
              <h2 className="font-montserrat text-[#F0E6C2] text-sm tracking-[0.2em] uppercase font-medium">Row Details</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#BFA06A]/10">
                  <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium w-16">Row</th>
                  <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Product</th>
                  <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium w-24">Status</th>
                  <th className="text-left px-6 py-3 font-montserrat text-[#F0E6C2]/50 text-xs tracking-[0.15em] uppercase font-medium">Error</th>
                </tr>
              </thead>
              <tbody>
                {response.results.map((r, i) => (
                  <tr key={i} className="border-b border-[#BFA06A]/5 hover:bg-white/[0.02]">
                    <td className="px-6 py-3 font-montserrat text-[#F0E6C2]/40 text-xs">{r.row}</td>
                    <td className="px-6 py-3 font-montserrat text-[#F0E6C2] text-sm">{r.product}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        {statusIcon(r.status)}
                        <span className={`font-montserrat text-xs tracking-[0.1em] uppercase ${statusColor(r.status)}`}>{r.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-montserrat text-red-400/70 text-xs">{r.error || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!response && (
        <div className="bg-[#0A0A0A] border border-[#BFA06A]/10 rounded p-8">
          <h3 className="font-montserrat text-[#F0E6C2] text-xs tracking-[0.2em] uppercase font-medium mb-6">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-cormorant text-[#BFA06A] text-xl">01</span>
                <span className="font-montserrat text-[#F0E6C2] text-sm font-medium">Download Template</span>
              </div>
              <p className="font-montserrat text-[#F0E6C2]/40 text-xs leading-relaxed">
                Click "Download Template" to get the Excel file with sample data and all columns pre-formatted.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-cormorant text-[#BFA06A] text-xl">02</span>
                <span className="font-montserrat text-[#F0E6C2] text-sm font-medium">Fill Your Data</span>
              </div>
              <p className="font-montserrat text-[#F0E6C2]/40 text-xs leading-relaxed">
                Delete the sample rows and add your products. Use the "Variants" sheet for multiple variants per product.
              </p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-cormorant text-[#BFA06A] text-xl">03</span>
                <span className="font-montserrat text-[#F0E6C2] text-sm font-medium">Upload & Import</span>
              </div>
              <p className="font-montserrat text-[#F0E6C2]/40 text-xs leading-relaxed">
                Upload the file. Existing products (same slug) will be updated. New products will be created with variants.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
