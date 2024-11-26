import React, { useEffect, useState } from 'react';

// Define interfaces
interface FinancialDetail {
  role: string;
  fullName: string;
  saidNumber: string;
  occupation: string;
  maritalStatus: string;
  grossMonthlyIncome: number;
  otherIncome: number;
}

interface Dependent {
  fullName: string;
  relationshipToApplicant: string;
  age: number;
  institutionName: string;
}

interface FixedProperty {
  physicalAddress: string;
  erfNoTownship: string;
  datePurchased: string;
  purchasePrice: number;
  municipalValue: number;
  presentValue: number;
}

interface Vehicle {
  makeModelYear: string;
  registrationNumber: string;
  presentValue: number;
}

interface Investment {
  company: string;
  description: string;
  marketValue: number;
}

interface OtherAsset {
  description: string;
  value: number;
}

interface Liability {
  description: string;
  amount: number;
}

interface BursaryApplication {
  name: string;
  surname: string;
  dateOfBirth: string;
  saidNumber: string;
  placeOfBirth: string;
  email: string;
  contactNumber: string;
  homePhysicalAddress: string;
  homePostalAddress: string;
  institutionAppliedFor: string;
  degreeOrDiploma: string;
  yearOfStudyAndCommencement: string;
  studentNumber: string;
  approximateFundingRequired: number;
  tertiarySubjectsAndResultsUrl: string;
  grade12SubjectsAndResultsUrl: string;
  grade11SubjectsAndResultsUrl: string;
  financialDetailsList: FinancialDetail[];
  dependents: Dependent[];
  fixedProperties: FixedProperty[];
  vehicles: Vehicle[];
  investments: Investment[];
  jewelleryValue: number;
  furnitureAndFittingsValue: number;
  equipmentValue: number;
  otherAssets: OtherAsset[];
  overdrafts: number;
  unsecuredLoans: number;
  creditCardDebts: number;
  incomeTaxDebts: number;
  otherLiabilities: Liability[];
  declarationSignedBy: string;
  declarationDate: string;
}

// Define props interfaces
interface ApplicationCardProps {
  application: BursaryApplication;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

interface DetailProps {
  label: string;
  value: React.ReactNode;
}

export default function BursaryApplicationList() {
  const [applications, setApplications] = useState<BursaryApplication[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('https://saleafapi-production.up.railway.app/api/BursaryApplication', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer your_token_here' // Replace with your actual token
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data: BursaryApplication[] = await response.json();
        setApplications(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Bursary Applications</h2>
      {applications.length > 0 ? (
        applications.map((app, index) => <ApplicationCard key={index} application={app} />)
      ) : (
        <div>No applications found.</div>
      )}
    </div>
  );
}

function ApplicationCard({ application }: ApplicationCardProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader} onClick={toggleExpanded}>
        <h3 style={styles.cardTitle}>
          {application.name} {application.surname}
        </h3>
        <button style={styles.expandButton}>{expanded ? 'Collapse' : 'Expand'}</button>
      </div>
      {expanded && (
        <div style={styles.cardContent}>
          {/* Personal Details */}
          <Section title="Personal Details">
            <Detail label="Full Name" value={`${application.name} ${application.surname}`} />
            <Detail label="Date of Birth" value={new Date(application.dateOfBirth).toLocaleDateString()} />
            <Detail label="SA ID Number" value={application.saidNumber} />
            <Detail label="Place of Birth" value={application.placeOfBirth} />
            <Detail label="Email" value={application.email} />
            <Detail label="Contact Number" value={application.contactNumber} />
            <Detail label="Home Physical Address" value={application.homePhysicalAddress} />
            <Detail label="Home Postal Address" value={application.homePostalAddress} />
          </Section>

          {/* Education Details */}
          <Section title="Education Details">
            <Detail label="Institution Applied For" value={application.institutionAppliedFor} />
            <Detail label="Degree or Diploma" value={application.degreeOrDiploma} />
            <Detail label="Year of Study and Commencement" value={application.yearOfStudyAndCommencement} />
            <Detail label="Student Number" value={application.studentNumber} />
            <Detail label="Approximate Funding Required" value={`R ${application.approximateFundingRequired}`} />
          </Section>

          {/* Documents */}
          <Section title="Documents">
            <Detail
              label="Tertiary Subjects and Results"
              value={
                <a href={application.tertiarySubjectsAndResultsUrl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              }
            />
            <Detail
              label="Grade 12 Subjects and Results"
              value={
                <a href={application.grade12SubjectsAndResultsUrl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              }
            />
            <Detail
              label="Grade 11 Subjects and Results"
              value={
                <a href={application.grade11SubjectsAndResultsUrl} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              }
            />
          </Section>

          {/* Financial Details */}
          <Section title="Financial Details">
            {application.financialDetailsList.map((detail: FinancialDetail, index: number) => (
              <div key={index} style={styles.subSection}>
                <h4 style={styles.subSectionTitle}>{detail.role}</h4>
                <Detail label="Full Name" value={detail.fullName} />
                <Detail label="SA ID Number" value={detail.saidNumber} />
                <Detail label="Occupation" value={detail.occupation} />
                <Detail label="Marital Status" value={detail.maritalStatus} />
                <Detail label="Gross Monthly Income" value={`R ${detail.grossMonthlyIncome}`} />
                <Detail label="Other Income" value={`R ${detail.otherIncome}`} />
              </div>
            ))}
          </Section>

          {/* Dependents */}
          <Section title="Dependents">
            {application.dependents.map((dependent: Dependent, index: number) => (
              <div key={index} style={styles.subSection}>
                <Detail label="Full Name" value={dependent.fullName} />
                <Detail label="Relationship" value={dependent.relationshipToApplicant} />
                <Detail label="Age" value={dependent.age} />
                <Detail label="Institution Name" value={dependent.institutionName} />
              </div>
            ))}
          </Section>

          {/* Assets */}
          <Section title="Assets">
            {/* Fixed Properties */}
            <SubSection title="Fixed Properties">
              {application.fixedProperties.map((property: FixedProperty, index: number) => (
                <div key={index} style={styles.subSectionItem}>
                  <Detail label="Physical Address" value={property.physicalAddress} />
                  <Detail label="ERF No/Township" value={property.erfNoTownship} />
                  <Detail label="Date Purchased" value={new Date(property.datePurchased).toLocaleDateString()} />
                  <Detail label="Purchase Price" value={`R ${property.purchasePrice}`} />
                  <Detail label="Municipal Value" value={`R ${property.municipalValue}`} />
                  <Detail label="Present Value" value={`R ${property.presentValue}`} />
                </div>
              ))}
            </SubSection>

            {/* Vehicles */}
            <SubSection title="Vehicles">
              {application.vehicles.map((vehicle: Vehicle, index: number) => (
                <div key={index} style={styles.subSectionItem}>
                  <Detail label="Make/Model/Year" value={vehicle.makeModelYear} />
                  <Detail label="Registration Number" value={vehicle.registrationNumber} />
                  <Detail label="Present Value" value={`R ${vehicle.presentValue}`} />
                </div>
              ))}
            </SubSection>

            {/* Investments */}
            <SubSection title="Investments">
              {application.investments.map((investment: Investment, index: number) => (
                <div key={index} style={styles.subSectionItem}>
                  <Detail label="Company" value={investment.company} />
                  <Detail label="Description" value={investment.description} />
                  <Detail label="Market Value" value={`R ${investment.marketValue}`} />
                </div>
              ))}
            </SubSection>

            {/* Other Assets */}
            <Detail label="Jewellery Value" value={`R ${application.jewelleryValue}`} />
            <Detail label="Furniture and Fittings Value" value={`R ${application.furnitureAndFittingsValue}`} />
            <Detail label="Equipment Value" value={`R ${application.equipmentValue}`} />
            {application.otherAssets.map((asset: OtherAsset, index: number) => (
              <div key={index} style={styles.subSectionItem}>
                <Detail label="Description" value={asset.description} />
                <Detail label="Value" value={`R ${asset.value}`} />
              </div>
            ))}
          </Section>

          {/* Liabilities */}
          <Section title="Liabilities">
            <Detail label="Overdrafts" value={`R ${application.overdrafts}`} />
            <Detail label="Unsecured Loans" value={`R ${application.unsecuredLoans}`} />
            <Detail label="Credit Card Debts" value={`R ${application.creditCardDebts}`} />
            <Detail label="Income Tax Debts" value={`R ${application.incomeTaxDebts}`} />
            {application.otherLiabilities.map((liability: Liability, index: number) => (
              <div key={index} style={styles.subSectionItem}>
                <Detail label="Description" value={liability.description} />
                <Detail label="Amount" value={`R ${liability.amount}`} />
              </div>
            ))}
          </Section>

          {/* Declaration */}
          <Section title="Declaration">
            <Detail label="Declaration Signed By" value={application.declarationSignedBy} />
            <Detail label="Declaration Date" value={new Date(application.declarationDate).toLocaleDateString()} />
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: SectionProps) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function SubSection({ title, children }: SubSectionProps) {
  return (
    <div style={styles.subSection}>
      <h4 style={styles.subSectionTitle}>{title}</h4>
      {children}
    </div>
  );
}

function Detail({ label, value }: DetailProps) {
  return (
    <div style={styles.detail}>
      <strong>{label}:</strong> {value}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '30px'
  },
  loading: {
    fontSize: '24px',
    textAlign: 'center',
    marginTop: '50px'
  },
  error: {
    fontSize: '24px',
    textAlign: 'center',
    marginTop: '50px',
    color: 'red'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '20px',
    overflow: 'hidden'
  },
  cardHeader: {
    backgroundColor: '#f7f7f7',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer'
  },
  cardTitle: {
    margin: 0,
    fontSize: '20px'
  },
  expandButton: {
    padding: '8px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: '#004f99',
    color: '#fff',
    border: 'none',
    borderRadius: '4px'
  },
  cardContent: {
    padding: '15px'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '18px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '5px',
    marginBottom: '10px'
  },
  subSection: {
    marginBottom: '15px',
    paddingLeft: '15px'
  },
  subSectionTitle: {
    fontSize: '16px',
    marginBottom: '10px'
  },
  subSectionItem: {
    marginBottom: '10px',
    paddingLeft: '10px'
  },
  detail: {
    marginBottom: '5px'
  }
};
