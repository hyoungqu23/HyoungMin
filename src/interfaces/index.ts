export interface ILayoutProps {
  children: React.ReactNode;
}

export interface IBaseErrorProps {
  error: Error;
  reset: () => void;
}
