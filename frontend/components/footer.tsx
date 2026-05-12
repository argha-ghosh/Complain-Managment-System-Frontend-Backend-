export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white text-center py-4 text-xs text-gray-400">
            © {new Date().getFullYear()} ZonePortal · City Complaint Management
        </footer>
    );
}