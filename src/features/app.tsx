import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

export function App() {
  return (
    <div>
      {/* // TODO zustand */}
      {/* // TODO persist tanstack query */}
      <RouterProvider router={router} />
      {/* // TODO hot toast */}
      {/* // TODO query devtools */}
    </div>
  );
}
