// legalServicesData.ts

export type LegalServiceSection = {
  id: string;
  titleKey: string;
  sections?: {
    header: string;
    paragraphs: string[];
    list?: string[];
  }[];
};

export const LEGAL_SERVICES_SECTIONS: LegalServiceSection[] = [
  {
    id: 'general',
    titleKey: 'general.title',
    sections: [
      {
        header: 'general.overview',
        paragraphs: [
          'general.content1',
          'general.content2'
        ],
        list: [
          'general.list.0',
          'general.list.1',
          'general.list.2'
        ]
      }
    ]
  },
  {
    id: 'corporate',
    titleKey: 'corporate.title',
    sections: [
      {
        header: 'corporate.formation',
        paragraphs: [
          'corporate.content1',
          'corporate.content2'
        ],
        list: [
          'corporate.list.0',
          'corporate.list.1',
          'corporate.list.2'
        ]
      },
      {
        header: 'corporate.operations',
        paragraphs: ['corporate.content3'],
        list: [
          'corporate.list2.0',
          'corporate.list2.1'
        ]
      },
      {
        header: 'corporate.governance',
        paragraphs: ['corporate.content4']
      }
    ]
  },
  {
    id: 'individual',
    titleKey: 'individual.title',
    sections: [
      {
        header: 'individual.familyLaw',
        paragraphs: ['individual.content1'],
        list: [
          'individual.list.0',
          'individual.list.1',
          'individual.list.2'
        ]
      },
      {
        header: 'individual.realEstate',
        paragraphs: ['individual.content2'],
        list: [
          'individual.list2.0',
          'individual.list2.1'
        ]
      },
      {
        header: 'individual.employmentAndCriminal',
        paragraphs: ['individual.content3'],
        list: [
          'individual.list3.0',
          'individual.list3.1'
        ]
      }
    ]
  },
  {
    id: 'legal-consultation-services',
    titleKey: 'legalConsultationServices.title',
    sections: [
      {
        header: 'legalConsultationServices.introduction',
        paragraphs: ['legalConsultationServices.content1']
      },
      {
        header: 'legalConsultationServices.scope',
        paragraphs: ['legalConsultationServices.content2']
      },
      {
        header: 'legalConsultationServices.methodology',
        paragraphs: ['legalConsultationServices.content3']
      }
    ]
  },
  {
    id: 'defense-in-all-cases',
    titleKey: 'defenseInAllCases.title',
    sections: [
      {
        header: 'defenseInAllCases.overview',
        paragraphs: ['defenseInAllCases.content1']
      },
      {
        header: 'defenseInAllCases.civil',
        paragraphs: ['defenseInAllCases.content2']
      },
      {
        header: 'defenseInAllCases.criminal',
        paragraphs: ['defenseInAllCases.content3']
      }
    ]
  },
  {
    id: 'services-for-companies-and-institutions',
    titleKey: 'servicesForCompaniesAndInstitutions.title',
    sections: [
      {
        header: 'servicesForCompaniesAndInstitutions.advisory',
        paragraphs: ['servicesForCompaniesAndInstitutions.content1']
      },
      {
        header: 'servicesForCompaniesAndInstitutions.compliance',
        paragraphs: ['servicesForCompaniesAndInstitutions.content2']
      },
      {
        header: 'servicesForCompaniesAndInstitutions.contracts',
        paragraphs: ['servicesForCompaniesAndInstitutions.content3']
      }
    ]
  },
  {
    id: 'establishing-national-and-foreign-companies',
    titleKey: 'establishingNationalAndForeignCompanies.title',
    sections: [
      {
        header: 'establishingNationalAndForeignCompanies.local',
        paragraphs: ['establishingNationalAndForeignCompanies.content1']
      },
      {
        header: 'establishingNationalAndForeignCompanies.international',
        paragraphs: ['establishingNationalAndForeignCompanies.content2']
      },
      {
        header: 'establishingNationalAndForeignCompanies.advisory',
        paragraphs: ['establishingNationalAndForeignCompanies.content3']
      }
    ]
  },
  {
    id: 'foreign-investment-services',
    titleKey: 'foreignInvestmentServices.title',
    sections: [
      {
        header: 'foreignInvestmentServices.introduction',
        paragraphs: ['foreignInvestmentServices.content1']
      },
      {
        header: 'foreignInvestmentServices.guidance',
        paragraphs: ['foreignInvestmentServices.content2']
      },
      {
        header: 'foreignInvestmentServices.compliance',
        paragraphs: ['foreignInvestmentServices.content3']
      }
    ]
  },
  {
    id: 'banks-and-financial-institutions',
    titleKey: 'banksAndFinancialInstitutions.title',
    sections: [
      {
        header: 'banksAndFinancialInstitutions.overview',
        paragraphs: ['banksAndFinancialInstitutions.content1']
      },
      {
        header: 'banksAndFinancialInstitutions.regulation',
        paragraphs: ['banksAndFinancialInstitutions.content2']
      },
      {
        header: 'banksAndFinancialInstitutions.disputeResolution',
        paragraphs: ['banksAndFinancialInstitutions.content3']
      }
    ]
  },
  {
    id: 'arbitration',
    titleKey: 'arbitration.title',
    sections: [
      {
        header: 'arbitration.overview',
        paragraphs: ['arbitration.content1']
      },
      {
        header: 'arbitration.process',
        paragraphs: ['arbitration.content2']
      },
      {
        header: 'arbitration.benefits',
        paragraphs: ['arbitration.content3']
      }
    ]
  },
  {
    id: 'commercial-agencies',
    titleKey: 'commercialAgencies.title',
    sections: [
      {
        header: 'commercialAgencies.overview',
        paragraphs: ['commercialAgencies.content1']
      },
      {
        header: 'commercialAgencies.registration',
        paragraphs: ['commercialAgencies.content2']
      },
      {
        header: 'commercialAgencies.management',
        paragraphs: ['commercialAgencies.content3']
      }
    ]
  },
  {
    id: 'contracts',
    titleKey: 'contracts.title',
    sections: [
      {
        header: 'contracts.drafting',
        paragraphs: ['contracts.content1']
      },
      {
        header: 'contracts.review',
        paragraphs: ['contracts.content2']
      },
      {
        header: 'contracts.negotiation',
        paragraphs: ['contracts.content3']
      }
    ]
  },
  {
    id: 'corporate-governance-services',
    titleKey: 'corporateGovernanceServices.title',
    sections: [
      {
        header: 'corporateGovernanceServices.overview',
        paragraphs: ['corporateGovernanceServices.content1']
      },
      {
        header: 'corporateGovernanceServices.policies',
        paragraphs: ['corporateGovernanceServices.content2']
      },
      {
        header: 'corporateGovernanceServices.compliance',
        paragraphs: ['corporateGovernanceServices.content3']
      }
    ]
  },
  {
    id: 'intellectual-property',
    titleKey: 'intellectualProperty.title',
    sections: [
      {
        header: 'intellectualProperty.overview',
        paragraphs: ['intellectualProperty.content1']
      },
      {
        header: 'intellectualProperty.protection',
        paragraphs: ['intellectualProperty.content2']
      },
      {
        header: 'intellectualProperty.management',
        paragraphs: ['intellectualProperty.content3']
      }
    ]
  },
  {
    id: 'supporting-vision-2030',
    titleKey: 'supportingVision2030.title',
    sections: [
      {
        header: 'supportingVision2030.overview',
        paragraphs: ['supportingVision2030.content1']
      },
      {
        header: 'supportingVision2030.projects',
        paragraphs: ['supportingVision2030.content2']
      },
      {
        header: 'supportingVision2030.legalSupport',
        paragraphs: ['supportingVision2030.content3']
      }
    ]
  },
  {
    id: 'notarization',
    titleKey: 'notarization.title',
    sections: [
      {
        header: 'notarization.overview',
        paragraphs: ['notarization.content1']
      },
      {
        header: 'notarization.services',
        paragraphs: ['notarization.content2']
      },
      {
        header: 'notarization.compliance',
        paragraphs: ['notarization.content3']
      }
    ]
  },
  {
    id: 'companies-liquidation',
    titleKey: 'companiesLiquidation.title',
    sections: [
      {
        header: 'companiesLiquidation.overview',
        paragraphs: ['companiesLiquidation.content1']
      },
      {
        header: 'companiesLiquidation.process',
        paragraphs: ['companiesLiquidation.content2']
      },
      {
        header: 'companiesLiquidation.advisory',
        paragraphs: ['companiesLiquidation.content3']
      }
    ]
  },
  {
    id: 'corporate-restructuring-and-reorganization',
    titleKey: 'corporateRestructuringAndReorganization.title',
    sections: [
      {
        header: 'corporateRestructuringAndReorganization.overview',
        paragraphs: ['corporateRestructuringAndReorganization.content1']
      },
      {
        header: 'corporateRestructuringAndReorganization.process',
        paragraphs: ['corporateRestructuringAndReorganization.content2']
      },
      {
        header: 'corporateRestructuringAndReorganization.legalSupport',
        paragraphs: ['corporateRestructuringAndReorganization.content3']
      }
    ]
  },
  {
    id: 'estates',
    titleKey: 'estates.title',
    sections: [
      {
        header: 'estates.overview',
        paragraphs: ['estates.content1']
      },
      {
        header: 'estates.inheritance',
        paragraphs: ['estates.content2']
      },
      {
        header: 'estates.disputes',
        paragraphs: ['estates.content3']
      }
    ]
  },
  {
    id: 'insurance',
    titleKey: 'insurance.title',
    sections: [
      {
        header: 'insurance.overview',
        paragraphs: ['insurance.content1']
      },
      {
        header: 'insurance.policies',
        paragraphs: ['insurance.content2']
      },
      {
        header: 'insurance.claims',
        paragraphs: ['insurance.content3']
      }
    ]
  },
  {
    id: 'internal-regulations-for-companies',
    titleKey: 'internalRegulationsForCompanies.title',
    sections: [
      {
        header: 'internalRegulationsForCompanies.overview',
        paragraphs: ['internalRegulationsForCompanies.content1']
      },
      {
        header: 'internalRegulationsForCompanies.drafting',
        paragraphs: ['internalRegulationsForCompanies.content2']
      },
      {
        header: 'internalRegulationsForCompanies.compliance',
        paragraphs: ['internalRegulationsForCompanies.content3']
      }
    ]
  }
];
