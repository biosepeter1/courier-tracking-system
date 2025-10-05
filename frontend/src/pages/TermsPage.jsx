import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, ArrowLeft, FileText, Scale, AlertTriangle, ShieldAlert, Users, CreditCard } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'

const TermsPage = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        {
          text: "By accessing or using the CourierTrack platform and services (\"Services\"), you agree to be bound by these Terms of Service (\"Terms\"). These Terms constitute a legally binding agreement between you and CourierTrack (\"we,\" \"us,\" or \"our\"). If you do not agree to these Terms, you must not access or use our Services."
        },
        {
          text: "We reserve the right to modify, amend, or update these Terms at any time. Any changes will be effective immediately upon posting on our platform. Your continued use of the Services after such changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically."
        }
      ]
    },
    {
      icon: Users,
      title: "Eligibility and Account Registration",
      content: [
        {
          subtitle: "Eligibility Requirements",
          text: "You must be at least 18 years of age and have the legal capacity to enter into a binding contract to use our Services. By registering for an account, you represent and warrant that you meet these requirements."
        },
        {
          subtitle: "Account Creation",
          text: "To access certain features of our Services, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete."
        },
        {
          subtitle: "Account Security",
          text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to comply with these security obligations."
        },
        {
          subtitle: "Account Termination",
          text: "We reserve the right to suspend or terminate your account at any time, with or without notice, for any reason, including but not limited to violation of these Terms, fraudulent activity, or misuse of our Services."
        }
      ]
    },
    {
      icon: Package,
      title: "Use of Services",
      content: [
        {
          subtitle: "Service Description",
          text: "CourierTrack provides a platform for courier and package tracking services. Our Services enable users to create shipments, track packages in real-time, manage deliveries, and communicate with our support team."
        },
        {
          subtitle: "License Grant",
          text: "Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use our Services for your personal or internal business purposes."
        },
        {
          subtitle: "Prohibited Uses",
          text: "You agree not to: (a) use the Services for any illegal purpose or in violation of any laws; (b) transmit any viruses, malware, or other harmful code; (c) interfere with or disrupt the Services or servers; (d) attempt to gain unauthorized access to any portion of the Services; (e) use automated means to access the Services without our express written permission; (f) impersonate any person or entity; (g) violate the rights of others, including intellectual property rights; or (h) engage in any activity that could harm our reputation or business."
        },
        {
          subtitle: "Shipment Restrictions",
          text: "You agree not to ship any prohibited, illegal, hazardous, or restricted items through our Services. You are solely responsible for ensuring that all shipments comply with applicable laws and regulations. We reserve the right to refuse service or cancel any shipment that violates these restrictions."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Fees and Payment",
      content: [
        {
          subtitle: "Service Fees",
          text: "Certain features of our Services may be subject to fees. All fees are quoted in U.S. Dollars and are non-refundable unless otherwise specified. We reserve the right to change our fees at any time, with notice provided through our platform or via email."
        },
        {
          subtitle: "Payment Terms",
          text: "You agree to pay all applicable fees for the Services you use. Payment must be made through the payment methods we accept. You authorize us to charge your designated payment method for all fees incurred."
        },
        {
          subtitle: "Late Payments",
          text: "If you fail to pay any fees when due, we may suspend or terminate your access to the Services until payment is received. We may also charge interest on overdue amounts at the rate of 1.5% per month or the maximum rate permitted by law, whichever is lower."
        },
        {
          subtitle: "Taxes",
          text: "All fees are exclusive of applicable taxes, duties, or similar governmental charges. You are responsible for paying all such taxes associated with your use of the Services, except for taxes based on our net income."
        }
      ]
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: [
        {
          subtitle: "Service Availability",
          text: "We strive to provide reliable and uninterrupted Services, but we do not guarantee that the Services will be available at all times or free from errors, bugs, or security vulnerabilities. The Services are provided on an \"as is\" and \"as available\" basis."
        },
        {
          subtitle: "Disclaimer of Warranties",
          text: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL MEET YOUR REQUIREMENTS OR THAT ERRORS WILL BE CORRECTED."
        },
        {
          subtitle: "Limitation of Damages",
          text: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL COURIERTRACK BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICES."
        },
        {
          subtitle: "Liability Cap",
          text: "OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER."
        },
        {
          subtitle: "Shipment Liability",
          text: "Our liability for lost, damaged, or delayed shipments is limited to the declared value of the shipment or the limits specified in our shipping terms, whichever is lower. You are responsible for purchasing additional insurance if you require higher coverage."
        }
      ]
    },
    {
      icon: ShieldAlert,
      title: "Indemnification",
      content: [
        {
          text: "You agree to indemnify, defend, and hold harmless CourierTrack, its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to: (a) your use of the Services; (b) your violation of these Terms; (c) your violation of any rights of another party; (d) your shipment of prohibited or illegal items; or (e) any content or information you submit through the Services."
        }
      ]
    },
    {
      icon: AlertTriangle,
      title: "Dispute Resolution",
      content: [
        {
          subtitle: "Governing Law",
          text: "These Terms shall be governed by and construed in accordance with the laws of the State of [Your State], without regard to its conflict of law principles."
        },
        {
          subtitle: "Arbitration Agreement",
          text: "Any dispute, controversy, or claim arising out of or relating to these Terms or the Services shall be resolved through binding arbitration in accordance with the Commercial Arbitration Rules of the American Arbitration Association. The arbitration shall be conducted in [Your City, State], and judgment on the arbitration award may be entered in any court having jurisdiction."
        },
        {
          subtitle: "Class Action Waiver",
          text: "YOU AGREE THAT ANY ARBITRATION OR PROCEEDING SHALL BE LIMITED TO THE DISPUTE BETWEEN YOU AND COURIERTRACK INDIVIDUALLY. TO THE FULLEST EXTENT PERMITTED BY LAW, (A) NO ARBITRATION OR PROCEEDING SHALL BE JOINED WITH ANY OTHER; (B) THERE IS NO RIGHT OR AUTHORITY FOR ANY DISPUTE TO BE ARBITRATED ON A CLASS-ACTION BASIS OR TO UTILIZE CLASS ACTION PROCEDURES; AND (C) THERE IS NO RIGHT OR AUTHORITY FOR ANY DISPUTE TO BE BROUGHT IN A PURPORTED REPRESENTATIVE CAPACITY ON BEHALF OF THE GENERAL PUBLIC OR ANY OTHER PERSONS."
        },
        {
          subtitle: "Exceptions",
          text: "Notwithstanding the above, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights."
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to CourierTrack. These Terms of Service ("Terms") govern your access to and use of our courier tracking platform, website, mobile applications, and related services (collectively, the "Services"). Please read these Terms carefully before using our Services.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy. If you do not agree to these Terms, you must immediately discontinue use of our Services.
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
                        {item.subtitle && (
                          <h3 className="font-semibold text-base sm:text-lg mb-2">{item.subtitle}</h3>
                        )}
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
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Intellectual Property Rights</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                All content, features, and functionality of the Services, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, data compilations, software, and the compilation thereof (collectively, the "Content"), are owned by CourierTrack or its licensors and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the Content, except as incidental to normal use of the Services or as expressly permitted in these Terms.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">User Content</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                You may be able to submit, upload, or post content through the Services, including shipment information, messages, and feedback (collectively, "User Content"). You retain all ownership rights in your User Content, but you grant us a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform your User Content in connection with operating and providing the Services.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                You represent and warrant that: (a) you own or have the necessary rights to submit the User Content; (b) your User Content does not violate any third-party rights, including intellectual property rights, privacy rights, or publicity rights; and (c) your User Content complies with these Terms and all applicable laws.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">Privacy and Data Protection</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                Your use of the Services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">Third-Party Services</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                Our Services may contain links to or integrate with third-party websites, applications, or services. We do not control and are not responsible for the content, privacy policies, or practices of any third-party services. Your use of third-party services is at your own risk and subject to their respective terms and conditions.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">Termination</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                You may terminate your account at any time by contacting our support team. Upon termination, your right to use the Services will immediately cease. We may terminate or suspend your account and access to the Services at any time, with or without cause or notice, including for violation of these Terms.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                Upon termination, all provisions of these Terms that by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnification obligations, and limitations of liability.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">Severability</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                If any provision of these Terms is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not be affected or impaired. The invalid provision shall be replaced with a valid provision that most closely reflects the intent of the original provision.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">Entire Agreement</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                These Terms, together with our Privacy Policy and any other legal notices published by us on the Services, constitute the entire agreement between you and CourierTrack regarding your use of the Services and supersede all prior agreements and understandings, whether written or oral.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold mb-4 mt-8">Contact Information</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms or our Services, please contact us at:
              </p>
              <div className="bg-muted/40 p-3 sm:p-4 rounded-md">
                <p className="font-medium mb-2 text-sm sm:text-base">CourierTrack Legal Department</p>
                <p className="text-xs sm:text-sm text-muted-foreground break-all">Email: legal@couriertrack.com</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Address: 123 Logistics Boulevard, Suite 400, City, State 12345</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Phone: +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-base sm:text-lg mb-2">Important Notice</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    By continuing to use CourierTrack's Services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these Terms, you must immediately stop using our Services. These Terms may be updated from time to time, and it is your responsibility to review them periodically.
                  </p>
                </div>
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

export default TermsPage
