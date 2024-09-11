import React from 'react'
import { FaUser, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { FiActivity } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Logo from '@/components/atoms/Logo/Logo'
import Footer from '@/components/Footer/Footer'

const Button = ({ onClick, text, colorClass }) => (
  <button
    className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 ${colorClass} text-sm font-bold leading-normal tracking-[0.015em]`}
    onClick={onClick}
  >
    <span className="truncate">{text}</span>
  </button>
)

const NavBar = () => (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#22581d] px-10 py-3">
      <div className="flex items-center gap-4 text-white">
        <Logo />
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">ATKL Records</h2>
      </div>
      <nav className="flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <NavItem link="/" text="Home" />
          <NavItem link="/artists" text="Artists" />
          <NavItem link="/releases" text="Releases" />
          <NavItem link="/about" text="About" />
          <NavItem link="/services" text="Services" />
          <NavItem link="/contact" text="Contact" />
        </div>
        <UserActions />
        <ProfileImage />
      </nav>
    </header>
  )

  const NavItem = ({ link, text }) => (
    <Link to={link} className="text-white text-sm font-medium leading-normal">
      {text}
    </Link>
  )

  const UserActions = () => (
    <div className="flex gap-2">
      <Button text="Add Artist" colorClass="bg-[#24db13] text-[#122e0f]" />
      <Button text="Add Release" colorClass="bg-[#22581d] text-white" />
      <Button text="" colorClass="bg-[#22581d] text-white">
        <FiActivity size={20} />
      </Button>
    </div>
  )

  const ProfileImage = () => (
    <div
      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
      style={{
        backgroundImage:
          'url("https://cdn.usegalileo.ai/stability/34d07dcb-88b2-4284-9481-ff71a462aa2e.png")',
      }}
    />
  )

  const Sidebar = () => (
    <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#122e0f] p-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <ProfileImage />
          <div className="flex flex-col">
            <h1 className="text-white text-base font-medium leading-normal">Admin Dashboard</h1>
            <p className="text-[#8bd685] text-sm font-normal leading-normal">Manage Users</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <SidebarItem icon={<FaUserPlus size={24} />} text="Create User" />
          <SidebarItem icon={<FaUser size={24} />} text="View Users" active />
          <SidebarItem icon={<FaUser size={24} />} text="Edit User" />
          <SidebarItem icon={<FaUserMinus size={24} />} text="Delete User" />
        </div>
      </div>
    </div>
  )

  const SidebarItem = ({ icon, text, active }) => (
    <div
      className={`flex items-center gap-3 px-3 py-2 ${active ? 'bg-[#22581d]' : ''}`}
    >
      <div className="text-white">{icon}</div>
      <p className="text-white text-sm font-medium leading-normal">{text}</p>
    </div>
  )

  const ContentSection = ({ title, children }) => (
    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        {title}
      </h2>
      {children}
    </div>
  )

  const Table = ({ rows }) => (
    <div className="flex overflow-hidden rounded-xl border border-[#2e7728] bg-[#122e0f]">
      <table className="flex-1">
        <thead>
          <tr className="bg-[#194116]">
            <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">
              Artist Name
            </th>
            <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">
              Username
            </th>
            <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">
              Email
            </th>
            <th className="px-4 py-3 text-left w-60 text-[#8bd685] text-sm font-medium leading-normal">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="border-t border-t-[#2e7728]" key={index}>
              <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                {row.artistName}
              </td>
              <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
                {row.username}
              </td>
              <td className="h-[72px] px-4 py-2 w-[400px] text-[#8bd685] text-sm font-normal leading-normal">
                {row.email}
              </td>
              <td className="h-[72px] px-4 py-2 w-60 text-[#8bd685] text-sm font-normal leading-normal">
                {row.actions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const AdminDashboard = () => {
    const users = [
      {
        artistName: 'SWEET_HATE',
        username: 'sweet.hate',
        email: 'sweet.hate@gmail.com',
        actions: 'Edit | Delete',
      },
      // Más usuarios aquí
    ]

    return (
      <div className="relative flex size-full min-h-screen flex-col bg-[#122e0f] dark group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <NavBar />
          <div className="gap-1 flex flex-1 justify-center py-5 px-6">
            <div className="layout-content-container flex flex-col w-80">
              <Sidebar />
            </div>
            <ContentSection title="Artists">
              <Table rows={users} />
            </ContentSection>
            <ContentSection title="Releases">
              {/* Agrega más contenido aquí */}
            </ContentSection>
          </div>
        </div>
          <Footer />
      </div>
    )
  }

  export default AdminDashboard
