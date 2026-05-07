import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaUser, FaPowerOff } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';

import defaultAvatar from '../../../assets/images/defaultAvatar.png';
import { post, setLogoutInProgress } from '../../../helpers/axios';
import { useAuth } from '../../../hooks/useAuth';
import { clearAuthData } from '../../../store/auth/authSlice';

const logoutUser = async () => await post('/logout/');

const ProfileMenu = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onMutate: async () => {
      setLogoutInProgress(true);
      await queryClient.cancelQueries();
    },
    onSettled: () => {
      queryClient.clear();
      dispatch(clearAuthData());
      navigate('/login', { replace: true });
      setLogoutInProgress(false);
    },
  });

  const handleLogout = (e) => {
    e.preventDefault();
    if (!logoutMutation.isPending) {
      logoutMutation.mutate();
    }
  };

  return (
    <Dropdown className="d-inline-block">
      <Dropdown.Toggle
        variant="transparent"
        className="header-item d-flex align-items-center"
        id="page-header-user-dropdown"
      >
        <img
          className="rounded-circle header-profile-user"
          style={{ width: '28px', height: '28px' }}
          src={defaultAvatar}
          alt="Header Avatar"
        />
        <span className="d-none d-xl-inline-block ms-2">{user?.email}</span>
        <FaChevronDown className="d-none d-xl-inline-block ms-1" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu-end">
        <Dropdown.Item as={Link} to="/profile">
          <FaUser className="font-size-16 align-middle me-1" />
          {t('profile')}
        </Dropdown.Item>

        <div className="dropdown-divider" />
        <Dropdown.Item
          as="button"
          className="dropdown-item text-danger"
          onClick={handleLogout}
        >
          <FaPowerOff className="font-size-16 align-middle me-1" />
          {logoutMutation.isPending ? t('logging_out') : t('logout')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ProfileMenu;
