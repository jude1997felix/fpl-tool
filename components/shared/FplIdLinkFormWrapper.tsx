'use client'
import FplIdLinkForm from './FplIdLinkForm'

export default function FplIdLinkFormWrapper() {
  return <FplIdLinkForm onLinked={() => window.location.reload()} />
}
