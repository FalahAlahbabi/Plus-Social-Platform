export const metadata = {
  title: "Plus",
  description: "CMPS 350 Phase 2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
