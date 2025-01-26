import { useParams } from 'react-router'

export const useAgentId = () => {
  const { uuid } = useParams();
  return uuid
}