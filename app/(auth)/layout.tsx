// this layout configures the whole folder of "auth" which are the children of the (auth) folder)

export default function authLayout({
    children   
}: {
    children: React.ReactNode
}) {
    return (
        <div className=" flex justify-center items-center h-full">
            {children}
        </div>
    )
}