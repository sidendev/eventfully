export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 flex items-center justify-center w-full">
            <div className="w-full max-w-md mx-auto">{children}</div>
        </div>
    );
}
