import Rail from "@/components/clinic/rail";
import Hero from "@/components/clinic/hero";
import Tariff from "@/components/clinic/tariff";
import House from "@/components/clinic/house";
import Appointment from "@/components/clinic/appointment";
import Colophon from "@/components/clinic/colophon";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "MARFIL — Dental Clinic",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle de Serrano 47",
    addressLocality: "Madrid",
    postalCode: "28001",
    addressCountry: "ES",
  },
  telephone: "+34 910 24 47 47",
  email: "hola@marfil.es",
  openingHours: "Mo-Fr 09:00-19:00",
  priceRange: "€€€",
  url: "https://marfil.es",
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Rail />
      {/* content clears the fixed left rail on desktop */}
      <div className="lg:pl-16 lg:pr-6">
        <main>
          <Hero />
          <Tariff />
          <House />
          <Appointment />
        </main>
        <Colophon />
      </div>
    </>
  );
}
