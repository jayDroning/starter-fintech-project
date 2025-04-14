import { Template } from "@/components/Hero"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Template>
            {children}
        </Template>
    )
}

export default Layout;