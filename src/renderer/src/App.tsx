import { useState, createContext, useRef, useEffect } from 'react'
import StudentIdInputBox from './components/StudentIdInputBox'
import Footer from './components/Footer'
import UserTable from './components/UserView'
import MessageBox from './components/MessageBox'
import Loading from './components/Loading'
import { StudentData } from './types'

type StateStoreProps = {
  studentId: string // 学籍番号
  statusCode: number // ステータスコード
  data: StudentData // 学生データ
  isLoading: {
    status: boolean // ローディング中かどうか
    message: string // ローディングメッセージ
  }
  inputEl: React.RefObject<HTMLInputElement> // 学籍番号入力ボックスのRef
  isDeprecatedPCReception: boolean // 非推奨機受付モードかどうか
  setStudentId: React.Dispatch<React.SetStateAction<string>> // 学籍番号のセッター
  setStatusCode: React.Dispatch<React.SetStateAction<number>> // ステータスコードのセッター
  setData: React.Dispatch<React.SetStateAction<StudentData>> // 学生データのセッター
  setIsDeprecatedPCReception: React.Dispatch<React.SetStateAction<boolean>> // 非推奨機受付モードのセッター
  setIsLoading: React.Dispatch<React.SetStateAction<StateStoreProps["isLoading"]>> // ローディング中かどうかのセッター
}

export const StateStore = createContext<StateStoreProps>({
  studentId: '',
  statusCode: 0,
  isLoading: {
    status: false,
    message: "",
  },
  data: {
    studentId: '',
    studentName: '',
    kana: '',
    department: '',
    remarks: '',
    supply: "",
    receptionStatus: false,
    isNeedNotify: false,
    isDeprecatedPC: false,
  },
  inputEl: { current: null },
  isDeprecatedPCReception: false,
  setStudentId: () => { },
  setStatusCode: () => { },
  setData: () => { },
  setIsDeprecatedPCReception: () => { },
  setIsLoading: () => { },
})

function App() {
  const [studentId, setStudentId] = useState<string>('')
  const [statusCode, setStatusCode] = useState<number>(0)
  const [data, setData] = useState<StudentData>({
    studentId: '',
    studentName: '',
    kana: '',
    department: '',
    remarks: '',
    supply: "",
    receptionStatus: false,
    isNeedNotify: false,
    isDeprecatedPC: false,
  })
  const [isDeprecatedPCReception, setIsDeprecatedPCReception] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<StateStoreProps["isLoading"]>({ status: false, message: "" })

  const inputEl = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsLoading({ status: true, message: "しばらくお待ち下さい..." })
    setIsLoading({ status: false, message: "" })
  }, []);

  return (
    <>
      <div className="container py-4">
        <StateStore.Provider value={{ studentId, setStudentId, statusCode, setStatusCode, data, setData, inputEl, isDeprecatedPCReception, setIsDeprecatedPCReception, isLoading, setIsLoading }}>
          <StudentIdInputBox />
          <MessageBox />
          {
            isLoading.status && <Loading message={isLoading.message} />
          }
          {
            studentId && <UserTable />
          }
          <Footer />
        </StateStore.Provider>
      </div>
    </>
  )
}

export default App
