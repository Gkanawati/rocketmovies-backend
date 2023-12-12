import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiCamera } from 'react-icons/fi';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

import { Container, Form, Avatar } from './styles';
import { BackButtonText } from '../../components/BackButtonText';
import avatarPlaceholder from '../../assets/avatar_placeholder.svg';
import { useAuth } from '../../hooks/auth';
import { api } from '../../services/api';

export function Profile() {
  const { user, updateProfile} = useAuth();

  const avatarFilePath = `${api.defaults.baseURL}/files/${user.avatar}`;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordOld, setPasswordOld] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar ? avatarFilePath : avatarPlaceholder);
  const [avatarFile, setAvatarFile] = useState(null);

  const navigate = useNavigate();

  async function handleUpdateProfile() {
    const updated = {
      name,
      email,
      password: passwordNew,
      old_password: passwordOld,
    }

    const userUpdated = Object.assign(user, updated);

    const response = await updateProfile({ user: userUpdated, avatarFile });

    if (response) {
      navigate(-1);
    }
  }

  function handleChangeAvatar(event) {
    const file = event.target.files[0];
    setAvatarFile(file);

    const imagePreview = URL.createObjectURL(file);
    setAvatarUrl(imagePreview);
  }

  return (
    <Container>
      <header>
        <BackButtonText />
      </header>

      <Form>
        <Avatar>
          <img
            src={avatarUrl}
            alt={user.name}
          />

          <label htmlFor="avatar">
            <FiCamera />
            <input
              id='avatar'
              type='file'
              onChange={handleChangeAvatar}
            />
          </label>
        </Avatar>

        <Input
          placeholder="Nome"
          type="text"
          icon={FiUser}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          placeholder="E-mail"
          type="text"
          icon={FiMail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Senha Atual"
          type="password"
          icon={FiLock}
          value={passwordOld}
          onChange={e => setPasswordOld(e.target.value)}
        />

        <Input
          placeholder="Nova senha"
          type="password"
          icon={FiLock}
          value={passwordNew}
          onChange={e => setPasswordNew(e.target.value)}
        />

        <Button 
          title="Salvar" 
          onClick={handleUpdateProfile}
        />
      </Form>
    </Container>
  )
}