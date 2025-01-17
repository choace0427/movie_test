import { Container, Group, Text, Anchor, Image } from "@mantine/core";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "transparent",
        color: "white",
      }}
      className="w-full h-[110px] md:mt-24 sm:mt-10 mt-10"
    >
      <Image
        src="/img/background_footer.png"
        alt="Background Footer"
        className="w-full h-full"
      />
    </footer>
  );
}
