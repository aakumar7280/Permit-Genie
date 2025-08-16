// Payment tier and permit application management
export const userTiers = {
  FREE: 'free',
  PREMIUM: 'premium'
};

export const subscriptionLimits = {
  [userTiers.FREE]: {
    maxPermitApplications: 1,
    permitSearchAccess: true,
    premiumFeatures: false
  },
  [userTiers.PREMIUM]: {
    maxPermitApplications: -1, // unlimited
    permitSearchAccess: true,
    premiumFeatures: true
  }
};

// Enhanced user management with payment tracking
export const createUserWithPaymentTier = (userData) => {
  return {
    ...userData,
    subscriptionTier: userTiers.FREE,
    freePermitApplicationsUsed: 0,
    totalPermitApplicationsUsed: 0,
    maxFreeApplications: 1,
    canApplyForPermit: true
  };
};

// Check if user can apply for a permit
export const canUserApplyForPermit = (user) => {
  if (user.subscriptionTier === userTiers.PREMIUM) {
    return true;
  }
  
  return user.freePermitApplicationsUsed < user.maxFreeApplications;
};

// Update user's permit application count
export const updateUserPermitUsage = (user) => {
  return {
    ...user,
    freePermitApplicationsUsed: user.freePermitApplicationsUsed + 1,
    totalPermitApplicationsUsed: user.totalPermitApplicationsUsed + 1,
    canApplyForPermit: canUserApplyForPermit({
      ...user,
      freePermitApplicationsUsed: user.freePermitApplicationsUsed + 1
    })
  };
};

// Get payment message for user
export const getPaymentMessage = (user) => {
  if (user.subscriptionTier === userTiers.PREMIUM) {
    return null;
  }
  
  const remaining = user.maxFreeApplications - user.freePermitApplicationsUsed;
  if (remaining > 0) {
    return `You have ${remaining} free permit application${remaining > 1 ? 's' : ''} remaining.`;
  }
  
  return 'You have used your free permit application. Upgrade to Premium for unlimited applications.';
};

// Simulate permit application requirement matching
export const analyzeProjectForPermits = (projectData) => {
  const { projectScope, workType, description } = projectData;
  
  // Simple keyword matching to determine if permits are needed
  const permitKeywords = [
    'construction', 'building', 'renovation', 'demolition', 'electrical', 
    'plumbing', 'hvac', 'restaurant', 'food', 'business', 'event', 
    'festival', 'outdoor', 'installation', 'sign', 'structural'
  ];
  
  const projectText = `${workType} ${projectScope} ${description}`.toLowerCase();
  
  // Check if any permit keywords are found
  const hasPermitKeywords = permitKeywords.some(keyword => 
    projectText.includes(keyword.toLowerCase())
  );
  
  // Simple permit classification based on work type
  const noPermitWorkTypes = [
    'interior decorating',
    'furniture placement',
    'painting (interior)',
    'landscaping (basic)',
    'cleaning',
    'maintenance (minor)',
    'equipment rental',
    'catering (off-site prep)'
  ];
  
  const requiresNoPermit = noPermitWorkTypes.some(type => 
    projectText.includes(type.toLowerCase())
  );
  
  return {
    requiresPermits: hasPermitKeywords && !requiresNoPermit,
    confidence: hasPermitKeywords ? 0.8 : 0.3,
    reasoning: hasPermitKeywords 
      ? 'Project involves construction, electrical, plumbing, or business activities that typically require permits.'
      : 'Project appears to be basic maintenance or decoration that may not require permits.'
  };
};
