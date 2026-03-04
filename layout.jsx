import './globals.css';

export const metadata = {
  title: 'AIlevator & Visiabell | Interactive Pitch',
  description: 'Elevating Business Through Intelligent Automation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
