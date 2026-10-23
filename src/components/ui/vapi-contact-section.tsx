'use client';

import React, { useState, type FormEvent } from 'react';
import { Mic, TrendingUp, ShieldCheck, Shield, CheckCircle2, Loader2, ChevronDown } from 'lucide-react';

export interface VapiContactSectionProps {
  id?: string;
  className?: string;
}

export function VapiContactSection({
  id = 'contact',
  className = '',
}: VapiContactSectionProps) {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');
  const [countryCode, setCountryCode] = useState('US');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    jobTitle: '',
    email: '',
    phone: '',
    callVolume: '',
    message: '',
    consent: false,
  });

  const isFormValid = Boolean(
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.companyName.trim() &&
    formData.jobTitle.trim() &&
    formData.email.trim() &&
    formData.email.includes('@') &&
    formData.phone.trim() &&
    formData.callVolume.trim() &&
    formData.message.trim() &&
    formData.consent
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || formState === 'sending') return;

    setFormState('sending');
    setFormError('');

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      companyName: formData.companyName.trim(),
      jobTitle: formData.jobTitle.trim(),
      email: formData.email.trim(),
      phone: `${countryCode} ${formData.phone.trim()}`,
      callVolume: formData.callVolume,
      message: formData.message.trim(),
      consent: formData.consent,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit. Please try again.');
      }

      setFormState('success');
      setFormData({
        firstName: '',
        lastName: '',
        companyName: '',
        jobTitle: '',
        email: '',
        phone: '',
        callVolume: '',
        message: '',
        consent: false,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setFormState('error');
    }
  };

  return (
    <section
      id={id}
      className={`relative w-full py-10 sm:py-14 lg:py-16 bg-[#F4F2ED] text-[#161614] overflow-hidden ${className}`}
      aria-label="Schedule a Demo"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ========================================================
              LEFT COLUMN: Value Proposition, Guarantees & Social Proof
          ======================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {/* Eyebrow */}
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-[#6E6B63] uppercase mb-2 sm:mb-2.5">
              SCHEDULE A DEMO
            </p>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#161614] leading-[1.12]">
              Talk to a<br />
              Voice AI expert
            </h2>

            {/* Subtitle */}
            <p className="mt-3 sm:mt-3.5 text-xs sm:text-sm text-[#55524B] leading-relaxed max-w-md">
              VirtualVox Scale is built for teams that need reliability, scale, and dedicated 24/7 AI voice support.
            </p>

            {/* Value Points List */}
            <div className="mt-6 sm:mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 text-[#161614]">
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
                <p className="text-xs sm:text-[13.5px] text-[#2C2924] font-normal leading-snug">
                  Custom real-time audio infrastructure with 99.9% uptime.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 text-[#161614]">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
                <p className="text-xs sm:text-[13.5px] text-[#2C2924] font-normal leading-snug">
                  Scale to millions of calls with sub-500ms latency.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 text-[#161614]">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
                <p className="text-xs sm:text-[13.5px] text-[#2C2924] font-normal leading-snug">
                  Conversational guardrails to keep you and your customers safe.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 text-[#161614]">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>
                <p className="text-xs sm:text-[13.5px] text-[#2C2924] font-normal leading-snug">
                  SOC2, HIPAA, &amp; PCI compliant
                </p>
              </div>
            </div>

            {/* Enterprise Logos Section */}
            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8" style={{ borderTop: '1px solid #D8D2C6' }}>
              <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#7A766F] uppercase mb-4 sm:mb-5">
                TRUSTED AT ENTERPRISE SCALE
              </p>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-[#44403A]">
                {/* Amazon */}
                <div className="flex items-center">
                  <span className="font-extrabold tracking-tighter text-lg sm:text-xl text-[#222]">amazon</span>
                </div>

                <div className="h-4 w-px bg-[#D6D0C4] hidden sm:block" />

                {/* Ring */}
                <div className="flex items-center">
                  <span className="font-bold tracking-tight text-base sm:text-lg text-[#222] lowercase">ring</span>
                </div>

                <div className="h-4 w-px bg-[#D6D0C4] hidden sm:block" />

                {/* Intuit */}
                <div className="flex items-center">
                  <span className="font-extrabold tracking-wider text-sm sm:text-base text-[#222]">InTUIT</span>
                </div>

                <div className="h-4 w-px bg-[#D6D0C4] hidden sm:block" />

                {/* ServiceTitan */}
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-xs sm:text-sm text-[#222]">ServiceTitan</span>
                </div>

                <div className="h-4 w-px bg-[#D6D0C4] hidden sm:block" />

                {/* New York Life */}
                <div className="flex items-center">
                  <span className="font-serif font-bold text-[11px] sm:text-xs tracking-wider text-[#222] uppercase">
                    New York Life
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: Enterprise Contact / Demo Request Form
          ======================================================== */}
          <div className="lg:col-span-7 w-full">
            {formState === 'success' ? (
              <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#D8D2C6] text-center shadow-xs">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#161614] mb-2">
                  Thank You for Connecting
                </h3>
                <p className="text-sm text-[#55524B] leading-relaxed max-w-md mx-auto mb-6">
                  Your request has been received. A VirtualVox Voice AI specialist will contact you within 24 hours to schedule your personalized demo.
                </p>
                <button
                  type="button"
                  onClick={() => setFormState('idle')}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-[#161614] text-white hover:bg-black transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label htmlFor="vv-first-name" className="block text-xs font-semibold text-[#161614] mb-1">
                      First Name<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      id="vv-first-name"
                      name="firstName"
                      type="text"
                      required
                      placeholder=""
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                      className="w-full h-10 px-3.5 rounded-lg text-xs sm:text-[13px] text-[#161614] bg-white border border-[#D6D0C4] focus:outline-none focus:border-[#161614] focus:ring-1 focus:ring-[#161614] transition-colors"
                      style={{ border: '1px solid #D6D0C4', backgroundColor: '#FFFFFF' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="vv-last-name" className="block text-xs font-semibold text-[#161614] mb-1">
                      Last Name<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      id="vv-last-name"
                      name="lastName"
                      type="text"
                      required
                      placeholder=""
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                      className="w-full h-10 px-3.5 rounded-lg text-xs sm:text-[13px] text-[#161614] bg-white border border-[#D6D0C4] focus:outline-none focus:border-[#161614] focus:ring-1 focus:ring-[#161614] transition-colors"
                      style={{ border: '1px solid #D6D0C4', backgroundColor: '#FFFFFF' }}
                    />
                  </div>
                </div>

                {/* Row 2: Company Name */}
                <div>
                  <label htmlFor="vv-company-name" className="block text-xs font-semibold text-[#161614] mb-1">
                    Company Name<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="vv-company-name"
                    name="companyName"
                    type="text"
                    required
                    placeholder=""
                    autoComplete="organization"
                    value={formData.companyName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-lg text-xs sm:text-[13px] text-[#161614] bg-white border border-[#D6D0C4] focus:outline-none focus:border-[#161614] focus:ring-1 focus:ring-[#161614] transition-colors"
                    style={{ border: '1px solid #D6D0C4', backgroundColor: '#FFFFFF' }}
                  />
                </div>

                {/* Row 3: Job Title */}
                <div>
                  <label htmlFor="vv-job-title" className="block text-xs font-semibold text-[#161614] mb-1">
                    Job Title<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    id="vv-job-title"
                    name="jobTitle"
                    type="text"
                    required
                    placeholder=""
                    autoComplete="organization-title"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-lg text-xs sm:text-[13px] text-[#161614] bg-white border border-[#D6D0C4] focus:outline-none focus:border-[#161614] focus:ring-1 focus:ring-[#161614] transition-colors"
                    style={{ border: '1px solid #D6D0C4', backgroundColor: '#FFFFFF' }}
                  />
                </div>

                {/* Row 4: Work Email & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div>
                    <label htmlFor="vv-work-email" className="block text-xs font-semibold text-[#161614] mb-1">
                      Work Email<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      id="vv-work-email"
                      name="email"
                      type="email"
                      required
                      placeholder=""
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full h-10 px-3.5 rounded-lg text-xs sm:text-[13px] text-[#161614] bg-white border border-[#D6D0C4] focus:outline-none focus:border-[#161614] focus:ring-1 focus:ring-[#161614] transition-colors"
                      style={{ border: '1px solid #D6D0C4', backgroundColor: '#FFFFFF' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="vv-phone-number" className="block text-xs font-semibold text-[#161614] mb-1">
                      Phone Number<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-2.5 flex items-center gap-1 text-[11px] font-medium text-[#6E6B63] pointer-events-none select-none">
                        <span>{countryCode}</span>
                        <ChevronDown className="w-3 h-3 text-[#9C968B]" />
                      </div>
                      <input
                        id="vv-phone-number"
                        name="phone"
                        type="tel"
                        required
                        placeholder=""
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full h-10 pl-14 pr-3.5 rounded-lg text-xs sm:text-[13px] text-[#161614] bg-white border border-[#D6D0C4] focus:outline-none focus:border-[#161614] focus:ring-1 focus:ring-[#161614] transition-colors"
                        style={{ border: '1px solid #D6D0C4', backgroundColor: '#FFFFFF' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 5: Yearly Call Volume */}
                <div>
                  <label htmlFor="vv-call-volume" className="block text-xs font-semibold text-[#161614] mb-1">
                    Yearly Call Volume<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="vv-call-volume"
                      name="callVolume"
                      required
                      value={formData.callVolume}
                      onChange={(e) => setFormData((prev) => ({ ...prev, callVolume: e.target.value }))}
                      className="w-full h-10 px-3.5 pr-8 rounded-lg text-xs sm:text-[13px] text-[#161614] bg-white border border-[#D6D0C4] focus:outline-none focus:border-[#161614] focus:ring-1 focus:ring-[#161614] transition-colors appearance-none cursor-pointer"
                      style={{ border: '1px solid #D6D0C4', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      <option value="under-10k">&lt; 10,000 calls / year</option>
                      <option value="10k-100k">10,000 – 100,000 calls / year</option>
                      <option value="100k-1m">100,000 – 1,000,000 calls / year</option>
                      <option value="over-1m">1,000,000+ calls / year</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#9C968B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Row 6: How can we help you? */}
                <div>
                  <label htmlFor="vv-message" className="block text-xs font-semibold text-[#161614] mb-1">
                    How can we help you?<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <textarea
                    id="vv-message"
                    name="message"
                    rows={3}
                    required
                    placeholder="Describe your use case and business objectives"
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    className="w-full p-3 rounded-lg text-xs sm:text-[13px] text-[#161614] bg-white border border-[#D6D0C4] focus:outline-none focus:border-[#161614] focus:ring-1 focus:ring-[#161614] transition-colors resize-y min-h-[75px]"
                    style={{ border: '1px solid #D6D0C4', backgroundColor: '#FFFFFF' }}
                  />
                </div>

                {/* Checkbox Consent */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="vv-consent"
                    name="consent"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData((prev) => ({ ...prev, consent: e.target.checked }))}
                    className="mt-0.5 h-3.5 w-3.5 rounded border-[#D6D0C4] text-[#161614] focus:ring-[#161614] cursor-pointer"
                  />
                  <label htmlFor="vv-consent" className="text-[11px] sm:text-xs text-[#635F57] leading-relaxed cursor-pointer select-none">
                    I&apos;d like VirtualVox to contact me by phone or text at the number above. Some messages may be automated or AI-generated - we&apos;ll keep it relevant, and you can always opt out.<span className="text-red-500 ml-0.5">*</span>
                  </label>
                </div>

                {/* Form Error Message */}
                {formState === 'error' && (
                  <p role="alert" className="text-xs text-red-600 font-medium pt-1">
                    {formError}
                  </p>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!isFormValid || formState === 'sending'}
                    className={`w-full h-11 rounded-lg text-xs sm:text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 select-none shadow-xs ${
                      isFormValid
                        ? 'bg-[#161614] text-white hover:bg-black hover:shadow-md cursor-pointer active:scale-[0.99]'
                        : 'bg-[#CDC7BA] text-[#7E7A70] cursor-not-allowed opacity-80'
                    }`}
                    style={{
                      backgroundColor: isFormValid ? '#161614' : '#CDC7BA',
                      color: isFormValid ? '#FFFFFF' : '#7E7A70',
                      cursor: isFormValid ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {formState === 'sending' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-current" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default VapiContactSection;
