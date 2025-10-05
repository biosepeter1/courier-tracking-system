import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ArrowLeft, Shield, Lock, Eye, Database, Mail, UserCheck } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

const PrivacyPage = () => {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you register for an account or use our services, we may collect personal information including but not limited to your name, email address, phone number, postal address, and payment information. This information is necessary to provide our courier and tracking services."
        },
        {
          subtitle: "Shipment Information",
          text: "We collect details about your shipments including sender and recipient information, package contents descriptions, delivery addresses, tracking numbers, and delivery status updates."
        },
        {
          subtitle: "Usage Data",
          text: "We automatically collect information about your interaction with our platform, including IP addresses, browser types, device information, pages visited, time spent on pages, and referring URLs."
        }
      ]
    },
    {
      icon: Shield,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "We use your information to process and fulfill shipment requests, provide real-time tracking updates, send delivery notifications, and manage your account."
        },
        {
          subtitle: "Communication",
          text: "We may use your contact information to send service-related communications, respond to inquiries, provide customer support, and send important updates about our services or policies."
        },
        {
          subtitle: "Service Improvement",
          text: "We analyze usage patterns and feedback to enhance our platform's functionality, improve user experience, develop new features, and optimize our courier services."
        },
        {
          subtitle: "Legal Compliance",
          text: "We may use your information to comply with applicable laws, regulations, legal processes, or governmental requests, and to protect our rights, property, and safety, as well as those of our users and the public."
        }
      ]
    },
    {
      icon: Eye,
      title: "Information Sharing and Disclosure",
      content: [
        {
          subtitle: "Service Providers",
          text: "We may share your information with third-party service providers who assist us in operating our platform and delivering our services, including payment processors, delivery partners, and IT service providers. These parties are contractually obligated to maintain confidentiality."
        },
        {
          subtitle: "Business Transfers",
          text: "In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on our platform of any such change in ownership."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required to do so by law or in response to valid requests by public authorities, including to meet national security or law enforcement requirements."
        },
        {
          subtitle: "With Your Consent",
          text: "We may share your information with third parties when we have your explicit consent to do so."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, firewalls, and regular security assessments."
        },
        {
          subtitle: "Data Transmission",
          text: "All data transmitted between your device and our servers is encrypted using SSL/TLS protocols to ensure secure communication."
        },
        {
          subtitle: "Access Controls",
          text: "We maintain strict internal access controls and limit access to personal information to employees, contractors, and agents who need to know that information to operate, develop, or improve our services."
        },
        {
          subtitle: "No Absolute Guarantee",
          text: "While we strive to protect your personal information, please note that no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your data."
        }
      ]
    },
    {
      icon: UserCheck,
      title: "Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You have the right to access, review, and update your personal information at any time through your account settings. If you need assistance, please contact our support team."
        },
        {
          subtitle: "Data Deletion",
          text: "You may request deletion of your personal information, subject to certain exceptions prescribed by law. Please note that we may retain certain information as required by law or for legitimate business purposes."
        },
        {
          subtitle: "Marketing Communications",
          text: "You may opt out of receiving promotional communications from us by following the unsubscribe instructions in those communications or by updating your preferences in your account settings. Please note that you may still receive service-related communications."
        },
        {
          subtitle: "Cookies and Tracking",
          text: "Most web browsers are set to accept cookies by default. You can choose to set your browser to remove or reject cookies, though this may affect the functionality of our platform."
        }
      ]
    },
    {
      icon: Mail,
      title: "Data Retention",
      content: [
        {
          subtitle: "Retention Period",
          text: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law."
        },
        {
          subtitle: "Account Deletion",
          text: "When you delete your account, we will delete or anonymize your personal information within a reasonable timeframe, except where we are required to retain it for legal, regulatory, or legitimate business purposes."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">CourierTrack</span>
            </Link>
            <Link 
              to="/login" 
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  CourierTrack ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our courier tracking platform and related services (collectively, the "Services"). Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Privacy Policy.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  If you do not agree with the terms of this Privacy Policy, please do not access or use our Services. We reserve the right to make changes to this Privacy Policy at any time. We will notify you of any material changes by posting the updated policy on our platform and updating the "Last updated" date.
                </p>
              </div>
            </CardContent>
          </Card>

          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 sm:gap-4 mb-6">
                    <div className="p-2 sm:p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      <section.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-2">{section.title}</h2>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {section.content.map((item, idx) => (
                      <div key={idx} className="ml-0 sm:ml-16">
                        <h3 className="font-semibold text-base sm:text-lg mb-2">{item.subtitle}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">International Data Transfers</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those in your jurisdiction. By using our Services, you consent to the transfer of your information to our facilities and to the third parties with whom we share it as described in this Privacy Policy.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">Third-Party Links</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                Our Services may contain links to third-party websites, applications, or services that are not owned or controlled by CourierTrack. We are not responsible for the privacy practices or content of these third parties. We encourage you to review the privacy policies of any third-party sites or services before providing any personal information.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">Contact Us</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-muted/40 p-3 sm:p-4 rounded-md">
                <p className="font-medium mb-2 text-sm sm:text-base">CourierTrack Support</p>
                <p className="text-xs sm:text-sm text-muted-foreground break-all">Email: privacy@couriertrack.com</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Address: 123 Logistics Boulevard, Suite 400, City, State 12345</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Phone: +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-semibold">CourierTrack</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} CourierTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PrivacyPage
