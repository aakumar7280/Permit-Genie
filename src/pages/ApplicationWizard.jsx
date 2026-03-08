import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles, AlertCircle, Building2, User, MapPin, Briefcase, ClipboardCheck } from 'lucide-react';
import Header from '../components/Header';
import { authAPI, applicationsAPI, permitsAPI } from '../services/api';

// ── Shared Styles (module-level so they're stable across renders) ──
const INPUT_CLS = "w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-200";
const INPUT_BG = { backgroundColor: '#2d2d2d', border: '1px solid #444' };
const handleFocusIn = (e) => { e.target.style.borderColor = '#F15025'; e.target.style.boxShadow = '0 0 0 2px rgba(241,80,37,0.2)'; };
const handleFocusOut = (e) => { e.target.style.borderColor = '#444'; e.target.style.boxShadow = 'none'; };

const FormInput = ({ label, field, required, type = 'text', placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-white mb-1.5">
      {label} {required && <span style={{ color: '#F15025' }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(field, e.target.value)}
      placeholder={placeholder}
      className={INPUT_CLS}
      style={INPUT_BG}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    />
  </div>
);

const FormTextArea = ({ label, field, required, placeholder, rows = 4, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-white mb-1.5">
      {label} {required && <span style={{ color: '#F15025' }}>*</span>}
    </label>
    <textarea
      value={value}
      onChange={e => onChange(field, e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={INPUT_CLS + ' resize-none'}
      style={{ ...INPUT_BG, minHeight: rows * 28 + 'px' }}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    />
  </div>
);

const FormSelect = ({ label, field, required, options, placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-white mb-1.5">
      {label} {required && <span style={{ color: '#F15025' }}>*</span>}
    </label>
    <select
      value={value}
      onChange={e => onChange(field, e.target.value)}
      className={INPUT_CLS}
      style={INPUT_BG}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const ReviewRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-xs" style={{ color: '#888' }}>{label}</span>
      <span className="text-sm text-white text-right max-w-[60%]">{value}</span>
    </div>
  );
};

const ApplicationWizard = () => {
  const { permitId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = authAPI.getCurrentUser();

  const [permit, setPermit] = useState(location.state?.permit || null);
  const [step, setStep] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Applicant
    applicantName: user ? `${user.firstName} ${user.lastName}` : '',
    applicantEmail: user?.email || '',
    applicantPhone: user?.phoneNumber || '',
    applicantDateOfBirth: '',
    mailingAddress: '',
    // Step 2: Property / Location
    propertyAddress: '',
    propertyUnit: '',
    propertyCity: 'Toronto',
    propertyPostalCode: '',
    propertyWard: '',
    propertyLegalDescription: '',
    propertyType: '',
    // Step 3: Business / Entity
    businessName: user?.companyName || '',
    businessTradeName: '',
    businessType: '',
    businessNumber: '',
    incorporationNumber: '',
    businessPhone: '',
    businessEmail: '',
    // Step 4: Project / Work Scope
    projectDescription: '',
    projectPurpose: '',
    projectStartDate: '',
    projectEndDate: '',
    estimatedCost: '',
    squareFootage: '',
    numberOfStoreys: '',
    contractorName: '',
    contractorPhone: '',
    contractorLicense: '',
    architectEngineer: '',
    // Step 5: Additional / Compliance
    zoningConfirmed: false,
    insuranceProvider: '',
    insurancePolicyNumber: '',
    previousPermitNumber: '',
    additionalNotes: '',
  });

  useEffect(() => {
    if (!permit && permitId) {
      const fetchPermit = async () => {
        try {
          const response = await permitsAPI.getPermitById(permitId);
          if (response.success) setPermit(response.permit);
        } catch (err) {
          setError('Could not load permit details');
        }
      };
      fetchPermit();
    }
  }, [permitId, permit]);

  const totalSteps = 6; // 5 form steps + 1 review

  const stepInfo = [
    { label: 'Applicant', icon: User },
    { label: 'Property', icon: MapPin },
    { label: 'Business', icon: Building2 },
    { label: 'Project', icon: Briefcase },
    { label: 'Compliance', icon: ClipboardCheck },
    { label: 'Review', icon: Check },
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.applicantName.trim()) return 'Full legal name is required';
        if (!formData.applicantEmail.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicantEmail)) return 'Please enter a valid email address';
        return null;
      case 2:
        if (!formData.propertyAddress.trim()) return 'Property address is required';
        if (!formData.propertyPostalCode.trim()) return 'Postal code is required';
        return null;
      case 3:
        return null; // Business info optional for some permits
      case 4:
        if (!formData.projectDescription.trim()) return 'Project description is required';
        return null;
      case 5:
        return null;
      default:
        return null;
    }
  };

  const nextStep = () => {
    const validationError = validateStep();
    if (validationError) { setError(validationError); return; }
    setError('');
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setError('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    setError('');
    try {
      const createRes = await applicationsAPI.createApplication({
        permitId: parseInt(permitId),
        ...formData,
      });
      if (!createRes.success) throw new Error(createRes.error || 'Failed to create application');
      const submitRes = await applicationsAPI.submitApplication(createRes.application.id);
      if (!submitRes.success) throw new Error(submitRes.error || 'Failed to submit application');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#191919' }}>
        <Header />
        <div className="pt-24 px-6 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 96px)' }}>
          <div className="max-w-lg w-full text-center rounded-2xl p-10" style={{ backgroundColor: '#222222', border: '1px solid #333' }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <Check size={32} style={{ color: '#22C55E' }} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
            <p className="mb-2" style={{ color: '#CED0CE' }}>
              Your application for <strong className="text-white">{permit?.name}</strong> has been submitted successfully.
            </p>
            <p className="text-sm mb-8" style={{ color: '#888' }}>
              You can track the status of your application from the My Applications page.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/applications')} className="px-6 py-2.5 rounded-xl text-white font-medium hover:opacity-90 transition-opacity" style={{ backgroundColor: '#F15025' }}>
                View My Applications
              </button>
              <button onClick={() => navigate('/search')} className="px-6 py-2.5 rounded-xl text-white font-medium transition-colors" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}>
                Search More Permits
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Render ──
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#191919' }}>
      <Header />
      <div className="pt-24 px-6 pb-12 max-w-2xl mx-auto">

        {/* Permit Info Banner */}
        {permit && (
          <div className="rounded-xl p-4 mb-6 flex items-start gap-3" style={{ backgroundColor: 'rgba(241,80,37,0.08)', border: '1px solid rgba(241,80,37,0.2)' }}>
            <Sparkles size={18} className="mt-0.5 flex-shrink-0" style={{ color: '#F15025' }} />
            <div>
              <p className="font-semibold text-white text-sm">Applying for: {permit.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#CED0CE' }}>{permit.category} — {permit.description?.slice(0, 120)}{permit.description?.length > 120 ? '...' : ''}</p>
            </div>
          </div>
        )}

        {/* ── Progress Bar ── */}
        <div className="flex items-center justify-between mb-8">
          {stepInfo.map((s, idx) => {
            const stepNum = idx + 1;
            const isActive = step === stepNum;
            const isComplete = step > stepNum;
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: isComplete ? '#F15025' : isActive ? 'rgba(241,80,37,0.2)' : '#2d2d2d',
                      border: isActive ? '2px solid #F15025' : '1px solid #444',
                      color: isComplete ? 'white' : isActive ? '#F15025' : '#888'
                    }}
                  >
                    {isComplete ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span className="text-[10px] mt-1.5 whitespace-nowrap" style={{ color: isActive ? '#F15025' : '#888' }}>{s.label}</span>
                </div>
                {idx < stepInfo.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mt-[-18px]" style={{ backgroundColor: isComplete ? '#F15025' : '#333' }}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Form Card ── */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: '#222222', border: '1px solid #333' }}>

          {/* ── Step 1: Applicant Information ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Applicant Information</h3>
                <p className="text-sm" style={{ color: '#CED0CE' }}>Provide your legal name and contact details as required by the City of Toronto.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Full Legal Name" field="applicantName" required placeholder="Jane Doe" value={formData.applicantName} onChange={handleChange} />
                <FormInput label="Date of Birth" field="applicantDateOfBirth" type="date" value={formData.applicantDateOfBirth} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Email Address" field="applicantEmail" required type="email" placeholder="jane@example.com" value={formData.applicantEmail} onChange={handleChange} />
                <FormInput label="Phone Number" field="applicantPhone" placeholder="(416) 555-0123" value={formData.applicantPhone} onChange={handleChange} />
              </div>
              <FormInput label="Mailing Address" field="mailingAddress" placeholder="123 Queen St W, Toronto, ON M5V 2A4" value={formData.mailingAddress} onChange={handleChange} />
            </div>
          )}

          {/* ── Step 2: Property / Location ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Property / Location Details</h3>
                <p className="text-sm" style={{ color: '#CED0CE' }}>Enter the municipal address where the permit will apply.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormInput label="Street Address" field="propertyAddress" required placeholder="456 King St W" value={formData.propertyAddress} onChange={handleChange} />
                </div>
                <FormInput label="Unit / Suite" field="propertyUnit" placeholder="Suite 200" value={formData.propertyUnit} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="City" field="propertyCity" placeholder="Toronto" value={formData.propertyCity} onChange={handleChange} />
                <FormInput label="Postal Code" field="propertyPostalCode" required placeholder="M5V 1M3" value={formData.propertyPostalCode} onChange={handleChange} />
                <FormInput label="Ward" field="propertyWard" placeholder="e.g. Ward 10" value={formData.propertyWard} onChange={handleChange} />
              </div>
              <FormSelect
                label="Property Type"
                field="propertyType"
                options={['Residential', 'Commercial', 'Industrial', 'Mixed-Use', 'Institutional', 'Vacant Land']}
                placeholder="Select property type..."
                value={formData.propertyType}
                onChange={handleChange}
              />
              <FormInput label="Legal Description (Lot, Plan)" field="propertyLegalDescription" placeholder="Lot 12, Plan 456, Block A" value={formData.propertyLegalDescription} onChange={handleChange} />
            </div>
          )}

          {/* ── Step 3: Business / Entity ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Business / Entity Details</h3>
                <p className="text-sm" style={{ color: '#CED0CE' }}>If applying on behalf of a business, fill in these details. Skip if not applicable.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Legal Business Name" field="businessName" placeholder="My Business Inc." value={formData.businessName} onChange={handleChange} />
                <FormInput label="Operating / Trade Name (DBA)" field="businessTradeName" placeholder="My Bakery" value={formData.businessTradeName} onChange={handleChange} />
              </div>
              <FormSelect
                label="Business Structure"
                field="businessType"
                options={['Sole Proprietorship', 'Partnership', 'Corporation', 'Non-Profit', 'Co-operative']}
                placeholder="Select structure..."
                value={formData.businessType}
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Ontario Business Number" field="businessNumber" placeholder="123456789 RT0001" value={formData.businessNumber} onChange={handleChange} />
                <FormInput label="Corporation Number" field="incorporationNumber" placeholder="ON-1234567" value={formData.incorporationNumber} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Business Phone" field="businessPhone" placeholder="(416) 555-9999" value={formData.businessPhone} onChange={handleChange} />
                <FormInput label="Business Email" field="businessEmail" type="email" placeholder="info@mybusiness.ca" value={formData.businessEmail} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* ── Step 4: Project / Work Scope ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Project / Work Scope</h3>
                <p className="text-sm" style={{ color: '#CED0CE' }}>Describe the proposed work and provide scope details.</p>
              </div>
              <FormTextArea label="Detailed Project Description" field="projectDescription" required placeholder="Describe the proposed work — e.g., converting ground floor retail space into a bakery with commercial kitchen, seating for 20 patrons, and a front patio." rows={4} value={formData.projectDescription} onChange={handleChange} />
              <FormSelect
                label="Project Purpose"
                field="projectPurpose"
                options={['New Construction', 'Renovation / Alteration', 'Change of Use', 'Addition', 'Demolition', 'Signage', 'Temporary Structure', 'Other']}
                placeholder="Select purpose..."
                value={formData.projectPurpose}
                onChange={handleChange}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Intended Start Date" field="projectStartDate" type="date" value={formData.projectStartDate} onChange={handleChange} />
                <FormInput label="Expected Completion Date" field="projectEndDate" type="date" value={formData.projectEndDate} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput label="Estimated Cost ($)" field="estimatedCost" placeholder="50,000" value={formData.estimatedCost} onChange={handleChange} />
                <FormInput label="Area (sq ft)" field="squareFootage" placeholder="1,200" value={formData.squareFootage} onChange={handleChange} />
                <FormInput label="Number of Storeys" field="numberOfStoreys" placeholder="2" value={formData.numberOfStoreys} onChange={handleChange} />
              </div>
              <p className="text-xs font-medium mt-2" style={{ color: '#CED0CE' }}>Contractor / Professional (if applicable)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Contractor Name" field="contractorName" placeholder="John's Construction Ltd." value={formData.contractorName} onChange={handleChange} />
                <FormInput label="Contractor Phone" field="contractorPhone" placeholder="(416) 555-7777" value={formData.contractorPhone} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Contractor Licence #" field="contractorLicense" placeholder="CON-12345" value={formData.contractorLicense} onChange={handleChange} />
                <FormInput label="Architect / Engineer" field="architectEngineer" placeholder="Smith & Associates Architects" value={formData.architectEngineer} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* ── Step 5: Additional / Compliance ── */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Compliance & Additional Info</h3>
                <p className="text-sm" style={{ color: '#CED0CE' }}>Confirmations and supporting info the City may require.</p>
              </div>
              {/* Zoning checkbox */}
              <div
                className="flex items-start gap-3 rounded-xl p-4 cursor-pointer"
                style={{ backgroundColor: '#2d2d2d', border: formData.zoningConfirmed ? '1px solid #F15025' : '1px solid #444' }}
                onClick={() => handleChange('zoningConfirmed', !formData.zoningConfirmed)}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={{
                    backgroundColor: formData.zoningConfirmed ? '#F15025' : 'transparent',
                    border: formData.zoningConfirmed ? '1px solid #F15025' : '1px solid #666'
                  }}
                >
                  {formData.zoningConfirmed && <Check size={14} className="text-white" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Zoning Compliance Confirmation</p>
                  <p className="text-xs mt-0.5" style={{ color: '#888' }}>I confirm that the proposed use is permitted under the current zoning by-law for this property, or that I am seeking the appropriate variance.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Insurance Provider" field="insuranceProvider" placeholder="Aviva Canada" value={formData.insuranceProvider} onChange={handleChange} />
                <FormInput label="Policy Number" field="insurancePolicyNumber" placeholder="POL-123456" value={formData.insurancePolicyNumber} onChange={handleChange} />
              </div>
              <FormInput label="Previous Permit Reference #" field="previousPermitNumber" placeholder="PER-2025-12345 (if applicable)" value={formData.previousPermitNumber} onChange={handleChange} />
              <FormTextArea label="Additional Notes" field="additionalNotes" placeholder="Anything else the City should know — special requirements, timeline constraints, etc." rows={3} value={formData.additionalNotes} onChange={handleChange} />
            </div>
          )}

          {/* ── Step 6: Review & Submit ── */}
          {step === 6 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Review & Submit</h3>
              <p className="text-sm mb-6" style={{ color: '#CED0CE' }}>Please review all details before submitting to the City of Toronto.</p>

              <div className="space-y-4">
                {/* Permit */}
                <div className="rounded-xl p-4" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}>
                  <p className="text-xs font-medium mb-2" style={{ color: '#F15025' }}>PERMIT</p>
                  <p className="text-white font-semibold">{permit?.name}</p>
                  <p className="text-xs" style={{ color: '#888' }}>{permit?.category}</p>
                </div>

                {/* Applicant */}
                <div className="rounded-xl p-4" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}>
                  <p className="text-xs font-medium mb-2" style={{ color: '#F15025' }}>APPLICANT</p>
                  <ReviewRow label="Name" value={formData.applicantName} />
                  <ReviewRow label="Email" value={formData.applicantEmail} />
                  <ReviewRow label="Phone" value={formData.applicantPhone} />
                  <ReviewRow label="Date of Birth" value={formData.applicantDateOfBirth} />
                  <ReviewRow label="Mailing Address" value={formData.mailingAddress} />
                </div>

                {/* Property */}
                <div className="rounded-xl p-4" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}>
                  <p className="text-xs font-medium mb-2" style={{ color: '#F15025' }}>PROPERTY / LOCATION</p>
                  <ReviewRow label="Address" value={[formData.propertyAddress, formData.propertyUnit].filter(Boolean).join(', ')} />
                  <ReviewRow label="City" value={formData.propertyCity} />
                  <ReviewRow label="Postal Code" value={formData.propertyPostalCode} />
                  <ReviewRow label="Ward" value={formData.propertyWard} />
                  <ReviewRow label="Property Type" value={formData.propertyType} />
                  <ReviewRow label="Legal Description" value={formData.propertyLegalDescription} />
                </div>

                {/* Business (only show if any field filled) */}
                {(formData.businessName || formData.businessTradeName || formData.businessType) && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}>
                    <p className="text-xs font-medium mb-2" style={{ color: '#F15025' }}>BUSINESS / ENTITY</p>
                    <ReviewRow label="Legal Name" value={formData.businessName} />
                    <ReviewRow label="Trade Name" value={formData.businessTradeName} />
                    <ReviewRow label="Structure" value={formData.businessType} />
                    <ReviewRow label="Business #" value={formData.businessNumber} />
                    <ReviewRow label="Corp #" value={formData.incorporationNumber} />
                    <ReviewRow label="Business Phone" value={formData.businessPhone} />
                    <ReviewRow label="Business Email" value={formData.businessEmail} />
                  </div>
                )}

                {/* Project */}
                <div className="rounded-xl p-4" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}>
                  <p className="text-xs font-medium mb-2" style={{ color: '#F15025' }}>PROJECT SCOPE</p>
                  <ReviewRow label="Description" value={formData.projectDescription} />
                  <ReviewRow label="Purpose" value={formData.projectPurpose} />
                  <ReviewRow label="Start Date" value={formData.projectStartDate} />
                  <ReviewRow label="End Date" value={formData.projectEndDate} />
                  <ReviewRow label="Est. Cost" value={formData.estimatedCost ? `$${formData.estimatedCost}` : ''} />
                  <ReviewRow label="Area" value={formData.squareFootage ? `${formData.squareFootage} sq ft` : ''} />
                  <ReviewRow label="Storeys" value={formData.numberOfStoreys} />
                  <ReviewRow label="Contractor" value={formData.contractorName} />
                  <ReviewRow label="Contractor Phone" value={formData.contractorPhone} />
                  <ReviewRow label="Contractor Licence" value={formData.contractorLicense} />
                  <ReviewRow label="Architect / Engineer" value={formData.architectEngineer} />
                </div>

                {/* Compliance */}
                <div className="rounded-xl p-4" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}>
                  <p className="text-xs font-medium mb-2" style={{ color: '#F15025' }}>COMPLIANCE</p>
                  <ReviewRow label="Zoning Confirmed" value={formData.zoningConfirmed ? '✓ Yes' : '✗ No'} />
                  <ReviewRow label="Insurance" value={formData.insuranceProvider} />
                  <ReviewRow label="Policy #" value={formData.insurancePolicyNumber} />
                  <ReviewRow label="Previous Permit" value={formData.previousPermitNumber} />
                  <ReviewRow label="Additional Notes" value={formData.additionalNotes} />
                </div>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertCircle size={16} style={{ color: '#EF4444' }} />
              <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex justify-between mt-8">
            <button
              onClick={step === 1 ? () => navigate(-1) : prevStep}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ backgroundColor: '#2d2d2d', color: '#CED0CE', border: '1px solid #444' }}
            >
              <ArrowLeft size={16} />
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#F15025' }}
              >
                Next
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#F15025' }}
              >
                {submitLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationWizard;
