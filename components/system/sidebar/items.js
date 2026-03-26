import { User, Users, Home, Clapperboard, BriefcaseBusiness, FolderOpenDot, NotebookPen, Medal, Notebook, Cpu } from "lucide-react";

export const tooltipStudentItems = [
  {
    label: 'Home',
    icon: Home,
    link: '/area-restrita/aluno',
    id: 'home'
  },
  {
    label: 'Meu perfil',
    icon: User,
    link: '/area-restrita/aluno/meu-perfil',
    id: 'meu-perfil'
  },
  {
    label: 'Meu projeto',
    icon: Users,
    link: '/area-restrita/aluno/meu-projeto',
    id: 'meu-projeto'
  },
  {
    label: 'Palestras',
    icon: Clapperboard,
    link: '/area-restrita/aluno/palestras',
    id: 'palestras'
  },
  {
    label: 'Empresas',
    icon: BriefcaseBusiness,
    link: '/area-restrita/aluno/empresas',
    id: 'empresas'
  },
  {
    label: 'Outros projetos',
    icon: FolderOpenDot,
    link: '/area-restrita/aluno/outros-projetos',
    id: 'outros-projetos'
  },/*
  {
    label: 'Ver avaliações',
    icon: NotebookPen,
    link: '/area-restrita/aluno/ver-avaliacoes',
    id: 'ver-avaliacoes'
  }*/
];

export const tooltipTeacherItems = [
  {
    label: 'Home',
    icon: Home,
    link: '/area-restrita/professor',
    id: 'home'
  },
  {
    label: 'Projetos',
    icon: FolderOpenDot,
    link: '/area-restrita/professor/projetos',
    id: 'projetos'
  },
  {
    label: 'Notas finais',
    icon: Notebook,
    link: '/area-restrita/professor/notas-finais',
    id: 'notas-finais'
  },
  {
    label: 'Ranking',
    icon: Medal,
    link: '/area-restrita/professor/ranking',
    id: 'ranking',
    target: '_blank'
  },
  {
    label: 'Torneio Robótica',
    icon: Cpu,
    link: 'https://forms.office.com/Pages/ResponsePage.aspx?id=HjuebwkYSkSB04LUCpKIEjKwfikByxNGkZWOSGd9GZJUM0hHQzM5TTdQOERJRDBSWFlYRTNUQVkyRi4u',
    id: 'torneio-robotica',
    target: '_blank'
  }
];

export const tooltipSupportItems = [
  {
    label: 'Home',
    icon: Home,
    link: '/area-restrita/apoio',
    id: 'home'
  },
];
