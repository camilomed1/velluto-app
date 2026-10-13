import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 7px;
`;

const Name = styled.h3`
  margin-top: 0.8rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export function FlavorCard({ name, image, onClick }) {
  return (
    <Card onClick={onClick}>
      <Image src={image} alt={name} />
      <Name>{name}</Name>
    </Card>
  );
}