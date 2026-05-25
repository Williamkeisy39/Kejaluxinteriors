import { Box } from "@chakra-ui/react";
import AdBanners from "../components/banners/AdBanners";
import Category from "../components/cat/Category";
import Featured from "../components/featured/Featured";
import Hero from "../components/hero/Hero";
import VideoShowcase from "../components/video/VideoShowcase";

export default function Home() {
  return (
    <Box
      bgColor={'gray.50'}>
      <Hero />
      <Category />
      <AdBanners />
      <VideoShowcase />
      <Featured />
    </Box>
  )
}
