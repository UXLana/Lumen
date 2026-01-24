'use client'

import React, { useState } from 'react'
import {
  colors,
  fontFamilies,
  typography,
  spacing,
} from '@/styles/design-tokens'

// =============================================================================
// ICONS
// =============================================================================

const AppsGridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="5" height="5" rx="1" fill="currentColor"/>
    <rect x="10" y="2.5" width="5" height="5" rx="1" fill="currentColor"/>
    <rect x="2.5" y="10" width="5" height="5" rx="1" fill="currentColor"/>
    <rect x="10" y="10" width="5" height="5" rx="1" fill="currentColor"/>
  </svg>
)

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 7.5L10 1.66667L17.5 7.5V16.6667C17.5 17.1087 17.3244 17.5326 17.0118 17.8452C16.6993 18.1577 16.2754 18.3333 15.8333 18.3333H4.16667C3.72464 18.3333 3.30072 18.1577 2.98816 17.8452C2.67559 17.5326 2.5 17.1087 2.5 16.6667V7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 18.3333V10H12.5V18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ProductsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 13.3333V6.66667C17.4997 6.37411 17.4225 6.08696 17.2763 5.83347C17.13 5.57998 16.9198 5.36908 16.6667 5.22167L10.8333 1.88833C10.5797 1.74065 10.2926 1.66272 10 1.66272C9.70744 1.66272 9.42029 1.74065 9.16667 1.88833L3.33333 5.22167C3.08022 5.36908 2.86998 5.57998 2.72372 5.83347C2.57745 6.08696 2.5003 6.37411 2.5 6.66667V13.3333C2.5003 13.6259 2.57745 13.913 2.72372 14.1665C2.86998 14.42 3.08022 14.6309 3.33333 14.7783L9.16667 18.1117C9.42029 18.2593 9.70744 18.3373 10 18.3373C10.2926 18.3373 10.5797 18.2593 10.8333 18.1117L16.6667 14.7783C16.9198 14.6309 17.13 14.42 17.2763 14.1665C17.4225 13.913 17.4997 13.6259 17.5 13.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.725 5.8L10 10.0083L17.275 5.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 18.4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const BundlesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.1667 1.66667H5.83333C4.91286 1.66667 4.16667 2.41286 4.16667 3.33333V16.6667C4.16667 17.5871 4.91286 18.3333 5.83333 18.3333H14.1667C15.0871 18.3333 15.8333 17.5871 15.8333 16.6667V3.33333C15.8333 2.41286 15.0871 1.66667 14.1667 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 8.33333H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 11.6667H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IntegrationsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 2.5H17.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 17.5H2.5V12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 2.5L11.6667 8.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 17.5L8.33333 11.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const EmployeesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.1667 17.5V15.8333C14.1667 14.9493 13.8155 14.1014 13.1904 13.4763C12.5652 12.8512 11.7174 12.5 10.8333 12.5H4.16667C3.28261 12.5 2.43476 12.8512 1.80964 13.4763C1.18452 14.1014 0.833336 14.9493 0.833336 15.8333V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.49999 9.16667C9.34094 9.16667 10.8333 7.67428 10.8333 5.83333C10.8333 3.99238 9.34094 2.5 7.49999 2.5C5.65904 2.5 4.16666 3.99238 4.16666 5.83333C4.16666 7.67428 5.65904 9.16667 7.49999 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.1667 12.5C16.0557 12.7513 16.0226 13.0302 16.0717 13.3005C16.1207 13.5708 16.2495 13.8203 16.4417 14.0167L16.4917 14.0667C16.6465 14.2214 16.7695 14.4053 16.8535 14.6076C16.9374 14.8099 16.9806 15.0267 16.9806 15.2458C16.9806 15.465 16.9374 15.6817 16.8535 15.8841C16.7695 16.0864 16.6465 16.2703 16.4917 16.425C16.337 16.5798 16.153 16.7028 15.9507 16.7867C15.7484 16.8707 15.5317 16.9139 15.3125 16.9139C15.0933 16.9139 14.8766 16.8707 14.6743 16.7867C14.472 16.7028 14.288 16.5798 14.1333 16.425L14.0833 16.375C13.8869 16.1828 13.6375 16.054 13.3672 16.005C13.0969 15.9559 12.818 15.989 12.5667 16.1C12.3203 16.2056 12.1124 16.3828 11.9692 16.6087C11.826 16.8346 11.7537 17.0985 11.7617 17.3667V17.5C11.7617 17.942 11.5861 18.3659 11.2735 18.6785C10.9609 18.9911 10.537 19.1667 10.095 19.1667C9.65296 19.1667 9.22904 18.9911 8.91648 18.6785C8.60391 18.3659 8.42834 17.942 8.42834 17.5V17.425C8.43047 17.1492 8.34816 16.8794 8.19201 16.6527C8.03585 16.426 7.8133 16.2535 7.55501 16.1583C7.30373 16.0474 7.02485 16.0143 6.75451 16.0633C6.48418 16.1124 6.23478 16.2412 6.03834 16.4333L5.98834 16.4833C5.83367 16.6381 5.64974 16.7611 5.44741 16.8451C5.24508 16.929 5.02832 16.9723 4.80917 16.9723C4.59003 16.9723 4.37327 16.929 4.17094 16.8451C3.96861 16.7611 3.78468 16.6381 3.63001 16.4833C3.47521 16.3287 3.35222 16.1447 3.26828 15.9424C3.18434 15.7401 3.14109 15.5233 3.14109 15.3042C3.14109 15.085 3.18434 14.8683 3.26828 14.6659C3.35222 14.4636 3.47521 14.2797 3.63001 14.125L3.68001 14.075C3.87218 13.8786 4.00096 13.6292 4.05002 13.3589C4.09907 13.0886 4.0659 12.8097 3.95501 12.5583C3.84938 12.312 3.67217 12.104 3.44627 11.9608C3.22036 11.8176 2.95651 11.7453 2.68834 11.7533H2.55501C2.11298 11.7533 1.68905 11.5778 1.37649 11.2652C1.06393 10.9526 0.888344 10.5287 0.888344 10.0867C0.888344 9.64464 1.06393 9.22072 1.37649 8.90815C1.68905 8.59559 2.11298 8.42001 2.55501 8.42001H2.63001C2.90582 8.42213 3.17566 8.33982 3.40236 8.18367C3.62907 8.02751 3.80155 7.80497 3.89668 7.54667C4.00757 7.29539 4.04074 7.01652 3.99168 6.74618C3.94263 6.47584 3.81385 6.22645 3.62168 6.03001L3.57168 5.98001C3.41688 5.82534 3.29389 5.64141 3.20995 5.43908C3.12601 5.23675 3.08275 5.01999 3.08275 4.80084C3.08275 4.5817 3.12601 4.36494 3.20995 4.16261C3.29389 3.96028 3.41688 3.77635 3.57168 3.62167C3.72634 3.46688 3.91028 3.34388 4.11261 3.25995C4.31494 3.17601 4.5317 3.13275 4.75084 3.13275C4.96999 3.13275 5.18675 3.17601 5.38908 3.25995C5.59141 3.34388 5.77534 3.46688 5.93001 3.62167L5.98001 3.67167C6.17645 3.86384 6.42585 3.99263 6.69618 4.04168C6.96651 4.09074 7.24539 4.05757 7.49668 3.94667H7.55501C7.80136 3.84105 8.00938 3.66383 8.15255 3.43793C8.29572 3.21203 8.36804 2.94817 8.36001 2.68001V2.50001C8.36001 2.05798 8.53559 1.63405 8.84815 1.32149C9.16072 1.00893 9.58464 0.833344 10.0267 0.833344C10.4687 0.833344 10.8926 1.00893 11.2052 1.32149C11.5178 1.63405 11.6933 2.05798 11.6933 2.50001V2.57501C11.6853 2.84317 11.7576 3.10703 11.9008 3.33293C12.044 3.55883 12.252 3.73605 12.4983 3.84167C12.7496 3.95257 13.0285 3.98574 13.2989 3.93668C13.5692 3.88763 13.8186 3.75885 14.015 3.56667L14.065 3.51667C14.2197 3.36188 14.4036 3.23888 14.606 3.15495C14.8083 3.07101 15.025 3.02775 15.2442 3.02775C15.4633 3.02775 15.6801 3.07101 15.8824 3.15495C16.0848 3.23888 16.2687 3.36188 16.4233 3.51667C16.5781 3.67134 16.7011 3.85528 16.7851 4.05761C16.869 4.25994 16.9123 4.4767 16.9123 4.69584C16.9123 4.91499 16.869 5.13175 16.7851 5.33408C16.7011 5.53641 16.5781 5.72034 16.4233 5.87501L16.3733 5.92501C16.1812 6.12145 16.0524 6.37085 16.0033 6.64118C15.9543 6.91151 15.9874 7.19039 16.0983 7.44167V7.50001C16.204 7.74636 16.3812 7.95438 16.6071 8.09755C16.833 8.24072 17.0968 8.31304 17.365 8.30501H17.5C17.942 8.30501 18.366 8.48059 18.6785 8.79315C18.9911 9.10572 19.1667 9.52964 19.1667 9.97167C19.1667 10.4137 18.9911 10.8376 18.6785 11.1502C18.366 11.4628 17.942 11.6383 17.5 11.6383H17.425C17.1569 11.6464 16.893 11.7187 16.6671 11.8619C16.4412 12.005 16.264 12.213 16.1583 12.4593" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3333 14.1667L17.5 10L13.3333 5.83334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10V5C12.5 3.61929 11.3807 2.5 10 2.5C8.61929 2.5 7.5 3.61929 7.5 5V10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 9.16667V10C15 12.7614 12.7614 15 10 15C7.23858 15 5 12.7614 5 10V9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 15V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.5789 18.2537 10.292 18.3304 10 18.3304C9.70803 18.3304 9.42117 18.2537 9.16816 18.1079C8.91515 17.9622 8.70486 17.7526 8.55835 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8.33333" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7.575 7.5C7.77092 6.94306 8.15763 6.47342 8.66664 6.17428C9.17566 5.87513 9.77408 5.76578 10.356 5.86529C10.9379 5.9648 11.4657 6.26794 11.8459 6.71961C12.2261 7.17128 12.4342 7.74294 12.4333 8.33333C12.4333 10 9.93335 10.8333 9.93335 10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="14.1667" r="0.833333" fill="currentColor"/>
  </svg>
)

const BoxIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 16V8C20.9996 7.6493 20.9071 7.30483 20.7315 7.00017C20.556 6.69552 20.3037 6.44179 20 6.26L13 2.26C12.696 2.07787 12.3511 1.98152 12 1.98152C11.6489 1.98152 11.304 2.07787 11 2.26L4 6.26C3.69626 6.44179 3.44398 6.69552 3.26846 7.00017C3.09294 7.30483 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9998C3.44398 17.3045 3.69626 17.5582 4 17.74L11 21.74C11.304 21.9221 11.6489 22.0185 12 22.0185C12.3511 22.0185 12.696 21.9221 13 21.74L20 17.74C20.3037 17.5582 20.556 17.3045 20.7315 16.9998C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.27002 6.96L12 12.01L20.73 6.96" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22.08V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const GridViewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="2.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const ListViewIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 5H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.66667 10H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.66667 15H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="3.33333" cy="5" r="1.25" fill="currentColor"/>
    <circle cx="3.33333" cy="10" r="1.25" fill="currentColor"/>
    <circle cx="3.33333" cy="15" r="1.25" fill="currentColor"/>
  </svg>
)

const PlusCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="8.33333" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 6.66667V13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.66667 10H13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [adminExpanded, setAdminExpanded] = useState(true)

  // Sample product data - matching the original exactly
  const products = Array(6).fill(null).map((_, i) => ({
    id: `product-${i}`,
    brand: 'Chill Labs',
    name: 'Blue Dream Premium Flower',
    sku: '12345-NG-567890',
    gapCount: 1,
    tags: ['Flower', 'THC 22%'],
    markets: [
      { code: 'CA', highlighted: true },
      { code: 'NV', highlighted: true },
      { code: 'NV', highlighted: false },
      { code: 'CO', highlighted: false },
    ],
  }))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Sidebar */}
      <aside style={{
        width: '200px',
        borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', marginBottom: '24px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#13352C',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}>
            <BoxIcon />
          </div>
          <div>
            <div style={{ fontFamily: fontFamilies.display, fontSize: '14px', fontWeight: 600, color: 'rgba(0,0,0,0.95)' }}>GCR</div>
            <div style={{ fontFamily: fontFamilies.body, fontSize: '11px', color: 'rgba(0,0,0,0.5)' }}>Global Cannabis Registry</div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {[
            { id: 'home', label: 'Home', icon: <HomeIcon />, active: false },
            { id: 'products', label: 'Products', icon: <ProductsIcon />, active: true },
            { id: 'bundles', label: 'Bundles', icon: <BundlesIcon />, active: false },
            { id: 'integrations', label: 'Integrations', icon: <IntegrationsIcon />, active: false },
          ].map(item => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: item.active ? '#13352C' : 'transparent',
                color: item.active ? '#FFFFFF' : 'rgba(0,0,0,0.7)',
                cursor: 'pointer',
                marginBottom: '4px',
                fontFamily: fontFamilies.body,
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <span style={{ display: 'flex', color: item.active ? '#FFFFFF' : 'rgba(0,0,0,0.5)' }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Admin Section */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px' }}>
          <div
            onClick={() => setAdminExpanded(!adminExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              cursor: 'pointer',
              fontFamily: fontFamilies.body,
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(0,0,0,0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Admin
            {adminExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </div>
          {adminExpanded && (
            <>
              {[
                { id: 'employees', label: 'Employees', icon: <EmployeesIcon /> },
                { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
              ].map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    color: 'rgba(0,0,0,0.7)',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    fontFamily: fontFamilies.body,
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  <span style={{ display: 'flex', color: 'rgba(0,0,0,0.5)' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </>
          )}

          {/* Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '8px',
            color: 'rgba(0,0,0,0.7)',
            cursor: 'pointer',
            marginTop: '8px',
            fontFamily: fontFamilies.body,
            fontSize: '14px',
            fontWeight: 500,
          }}>
            <span style={{ display: 'flex', color: 'rgba(0,0,0,0.5)' }}><LogoutIcon /></span>
            Logout
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          height: '64px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}>
          {/* Left - Apps Grid */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(0,0,0,0.5)' }}>
            <AppsGridIcon />
          </div>

          {/* Center - Search */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '400px',
            height: '40px',
            backgroundColor: '#F5F5F5',
            borderRadius: '20px',
            padding: '0 16px',
          }}>
            <span style={{ color: 'rgba(0,0,0,0.5)' }}><SearchIcon /></span>
            <input
              type="text"
              placeholder="Find or ask about a product or integration"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontFamily: fontFamilies.body,
                fontSize: '14px',
                color: 'rgba(0,0,0,0.95)',
              }}
            />
            <span style={{ color: 'rgba(0,0,0,0.5)' }}><MicIcon /></span>
          </div>

          {/* Right - Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{ width: '40px', height: '40px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BellIcon />
            </button>
            <button style={{ width: '40px', height: '40px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HelpIcon />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: '#13352C',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: fontFamilies.body,
                fontSize: '12px',
                fontWeight: 600,
              }}>ON</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: fontFamilies.body, fontSize: '14px', fontWeight: 500, color: 'rgba(0,0,0,0.95)' }}>Organization Name</div>
                <div style={{ fontFamily: fontFamilies.body, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>Organization</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* Page Title */}
          <h1 style={{
            fontFamily: fontFamilies.display,
            fontSize: '32px',
            fontWeight: 600,
            color: 'rgba(0,0,0,0.95)',
            marginBottom: '8px',
          }}>Products</h1>
          <p style={{
            fontFamily: fontFamilies.body,
            fontSize: '16px',
            color: 'rgba(0,0,0,0.6)',
            marginBottom: '32px',
          }}>Browse Metrc-verified applications for compliance, inventory, and operations.</p>

          {/* Product Stats */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{
                fontFamily: fontFamilies.display,
                fontSize: '18px',
                fontWeight: 600,
                color: 'rgba(0,0,0,0.95)',
              }}>Product stats</h2>
              <button style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.5)' }}>
                <EditIcon />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[
                { label: 'Total products', value: '74' },
                { label: 'Total bundles', value: '15' },
                { label: 'Drafts', value: '2' },
                { label: 'Active', value: '65' },
              ].map((stat, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '12px',
                  minWidth: '160px',
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(0,0,0,0.4)',
                  }}>
                    <BoxIcon />
                  </div>
                  <div>
                    <div style={{ fontFamily: fontFamilies.body, fontSize: '14px', color: 'rgba(0,0,0,0.6)' }}>{stat.label}</div>
                    <div style={{ fontFamily: fontFamilies.display, fontSize: '28px', fontWeight: 600, color: 'rgba(0,0,0,0.95)' }}>{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs and Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '0' }}>
              {['All products', 'Markets', 'Brands'].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
                  style={{
                    padding: '14px 16px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontFamily: fontFamilies.body,
                    fontSize: '14px',
                    fontWeight: 600,
                    color: i === 0 ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.6)',
                    borderBottom: i === 0 ? '2px solid #13352C' : '2px solid transparent',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: '#13352C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontFamily: fontFamilies.body,
              fontSize: '14px',
              fontWeight: 600,
            }}>
              <PlusCircleIcon />
              Register new product
            </button>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <select style={{
              height: '36px',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: '#FFFFFF',
              fontFamily: fontFamilies.body,
              fontSize: '14px',
              color: 'rgba(0,0,0,0.95)',
              cursor: 'pointer',
              appearance: 'none',
              paddingRight: '32px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}>
              <option>Select mode</option>
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ width: '36px', height: '36px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GridViewIcon />
              </button>
              <button style={{ width: '36px', height: '36px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ListViewIcon />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '32px',
          }}>
            {products.map((product) => (
              <div key={product.id} style={{
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                {/* Image */}
                <div style={{
                  height: '160px',
                  backgroundColor: '#F5F5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '12px',
                  borderRadius: '8px',
                  color: 'rgba(0,0,0,0.2)',
                }}>
                  <BoxIcon />
                </div>

                {/* Content */}
                <div style={{ padding: '0 16px 16px' }}>
                  <div style={{ fontFamily: fontFamilies.body, fontSize: '12px', fontWeight: 500, color: 'rgba(0,0,0,0.6)', marginBottom: '4px' }}>{product.brand}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: fontFamilies.display, fontSize: '16px', fontWeight: 600, color: 'rgba(0,0,0,0.95)' }}>{product.name}</span>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: 'rgba(0,0,0,0.06)',
                      borderRadius: '12px',
                      fontFamily: fontFamilies.body,
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'rgba(0,0,0,0.7)',
                    }}>{product.gapCount} Gap</span>
                  </div>
                  <div style={{ fontFamily: fontFamilies.mono, fontSize: '12px', color: 'rgba(0,0,0,0.5)', marginBottom: '12px' }}>{product.sku}</div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {product.tags.map((tag, i) => (
                      <span key={i} style={{
                        padding: '6px 12px',
                        backgroundColor: '#F5F5F5',
                        borderRadius: '6px',
                        fontFamily: fontFamilies.body,
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'rgba(0,0,0,0.7)',
                      }}>{tag}</span>
                    ))}
                  </div>

                  {/* Markets */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: fontFamilies.body, fontSize: '12px', fontWeight: 500, color: 'rgba(0,0,0,0.6)' }}>Markets</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {product.markets.map((market, i) => (
                        <span key={i} style={{
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          backgroundColor: market.highlighted ? '#78CFB8' : '#F5F5F5',
                          fontFamily: fontFamilies.body,
                          fontSize: '11px',
                          fontWeight: 600,
                          color: market.highlighted ? '#0B1E19' : 'rgba(0,0,0,0.7)',
                        }}>{market.code}</span>
                      ))}
                    </div>
                    <span style={{ fontFamily: fontFamilies.body, fontSize: '12px', color: 'rgba(0,0,0,0.5)', marginLeft: 'auto' }}>3/4 Markets</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px' }}>
            <span style={{ fontFamily: fontFamilies.body, fontSize: '14px', color: 'rgba(0,0,0,0.7)' }}>80-90 of 90</span>
            <select style={{
              height: '32px',
              padding: '0 12px',
              borderRadius: '6px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: '#FFFFFF',
              fontFamily: fontFamilies.body,
              fontSize: '14px',
              cursor: 'pointer',
            }}>
              <option>10 per page</option>
            </select>
            <span style={{ fontFamily: fontFamilies.body, fontSize: '14px', fontWeight: 500, color: 'rgba(0,0,0,0.95)' }}>Page 9 of 9</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['first', 'prev', 'next', 'last'].map((btn) => (
                <button key={btn} style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  cursor: btn === 'next' || btn === 'last' ? 'not-allowed' : 'pointer',
                  color: btn === 'next' || btn === 'last' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {btn === 'first' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                  {btn === 'prev' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {btn === 'next' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {btn === 'last' && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
