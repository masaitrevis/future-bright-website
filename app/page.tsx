import Hero from "./components/Hero";
import OurStory from "./components/OurStory";
import SubsidiariesOverview from "./components/SubsidiariesOverview";
import Values from "./components/Values";
import Leadership from "./components/Leadership";
import CTA from "./components/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <OurStory />
      <SubsidiariesOverview />
      <Values />
      <Leadership />
      <CTA />
    </>
  );
}
