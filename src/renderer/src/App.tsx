import StudentIdInputBox from './components/StudentIdInputBox';
import Footer from './components/Footer';
import UserTable from './components/UserView';
import MessageBox from './components/MessageBox';
import Loading from './components/Loading';
import { useAtomValue } from 'jotai';
import { isLoadingAtom, studentIdAtom } from './atom';
import { useRef } from 'react';

function App(): JSX.Element {
  const studentId = useAtomValue(studentIdAtom);
  const isLoading = useAtomValue(isLoadingAtom);

  const inputEl = useRef<HTMLInputElement | null>(null);
  const handleResrtInputStudentId = () => {
    if (inputEl.current) {
      inputEl.current.value = '';
      inputEl.current.focus();
    }
  };

  return (
    <div className="container py-4">
      <StudentIdInputBox ref={inputEl} handleResrtInputStudentId={handleResrtInputStudentId} />
      <MessageBox />
      {isLoading.status && <Loading message={isLoading.message} />}
      {studentId && <UserTable handleResrtInputStudentId={handleResrtInputStudentId} />}
      <Footer />
    </div>
  );
}

export default App;
