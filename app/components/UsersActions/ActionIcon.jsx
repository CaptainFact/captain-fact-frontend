import {
  ChevronDown,
  ChevronUp,
  Flag,
  HelpCircle,
  ListChecks,
  Pencil,
  Plus,
  Undo,
  X,
} from 'lucide-react'
import React from 'react'

const ACTIONS_ICONS = {
  create: Plus,
  remove: X,
  update: Pencil,
  delete: X,
  add: Plus,
  revert: Undo,
  flag: Flag,
  confirmed_flag: Flag,
  vote_up: ChevronUp,
  vote_down: ChevronDown,
  self_vote: ChevronUp,
  revert_vote_up: ChevronDown,
  revert_vote_down: ChevronUp,
  revert_self_vote: ChevronDown,
  start_automatic_statements_extraction: ListChecks,
}

const getIcon = (type) => ACTIONS_ICONS[type] || HelpCircle

const ActionIcon = ({ type, className, size = 14 }) => {
  const Icon = getIcon(type)
  return <Icon className={className} size={size} />
}

export default ActionIcon
