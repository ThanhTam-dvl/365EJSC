import { useParams } from 'react-router-dom';

export function UserDetail() {
    const { id } = useParams();
  return (
    <h2>User Detail for ID: {id}</h2>
  );
}
