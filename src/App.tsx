import React, { useState, useRef } from 'react';
import { FileDown, Plus, Trash2, Image, Check, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface FinancialEntry {
  id: string;
  description: string;
  amount: number;
  image?: string;
}

interface ApartmentPayment {
  id: string;
  name: string;
  paid: boolean;
  amount: number;
}

function App() {
  const [startBalance, setStartBalance] = useState<number>(0);
  const [incomeEntries, setIncomeEntries] = useState<FinancialEntry[]>([
    { id: '1', description: '', amount: 0 }
  ]);
  const [expenseEntries, setExpenseEntries] = useState<FinancialEntry[]>([
    { id: '1', description: '', amount: 0 }
  ]);
  const [notes, setNotes] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [apartmentPayments, setApartmentPayments] = useState<ApartmentPayment[]>([
    { id: '1', name: 'شقة 1/ أ/ سعيد ندى', paid: false, amount: 0 },
    { id: '2', name: 'شقة 2/ لواء / محمد عثمان', paid: false, amount: 0 },
    { id: '3', name: 'شقة 11/ أ /محمد منير', paid: false, amount: 0 },
    { id: '4', name: 'شقة 12/أ / ايمن البدرى ', paid: false, amount: 0 },
    { id: '5', name: 'شقة 13 /عميد / ياسر شلتوت', paid: false, amount: 0 },
    { id: '6', name: 'شقة 14 / أ/ اسلام فاضل', paid: false, amount: 0 },
    { id: '7', name: 'شقة 21 / أ/ خالد ', paid: false, amount: 0 },
    { id: '8', name: 'شقة 22 / دكتور / سمير', paid: false, amount: 0 },
    { id: '9', name: 'شقة 23 / م/ حسن المصرى', paid: false, amount: 0 },
    { id: '10', name: 'شقة 24 / أ /محمد عبدالظاهر', paid: false, amount: 0 },
    { id: '11', name: 'شقة 31 / دكتور / يحيى زكريا', paid: false, amount: 0 },
    { id: '12', name: 'شقة 32 / دكتور / اشرف ', paid: false, amount: 0 },
    { id: '13', name: 'شقة 33/ أ/ محمد المصرى', paid: false, amount: 0 },
    { id: '14', name: 'شقة 34/ دكتور / احمد سمير', paid: false, amount: 0 },
    { id: '15', name: 'شقة 41/ ك /عبدالرحمن نصر الدين', paid: false, amount: 0 },
    { id: '16', name: 'شقة 42/لواء / محسن صلاح الدين ', paid: false, amount: 0 },
    { id: '17', name: 'شقة 43 /م / عماد على ', paid: false, amount: 0 },
    { id: '18', name: 'شقة 44 / لواء / اسامة ابو زيد', paid: false, amount: 0 },
    { id: '19', name: 'شقة 51 / م/ يسرى لطفى ', paid: false, amount: 0 },
    { id: '20', name: 'شقة 52 / مستشار / عبدالله', paid: false, amount: 0 },
    { id: '21', name: 'شقة 53 / م/ محمد اسامة', paid: false, amount: 0 },
    { id: '22', name: 'شقة 54 / دكتور /يحيى النمر', paid: false, amount: 0 },
    { id: '23', name: 'شقة 61 / م / كامل القاضى', paid: false, amount: 0 },
    { id: '24', name: 'شقة 62 / لواء/ بليغ ', paid: false, amount: 0 },
    { id: '25', name: 'شقة 63 / لواء.د/ ايمان الشربينى ', paid: false, amount: 0 },
    { id: '26', name: 'شقة 64 / أ / نائل', paid: false, amount: 0 },
    { id: '27', name: 'شقة 71 / مستشار/ اسلام ', paid: false, amount: 0 },
    { id: '28', name: 'شقة 72 / دكتور /مجدى النشار', paid: false, amount: 0 },
    { id: '29', name: 'شقة 73 / لواء / فوزى ', paid: false, amount: 0 },
    { id: '30', name: 'شقة 74 / م / احمد فرج ', paid: false, amount: 0 },
    { id: '31', name: 'شقة 81/ ك/ احمد فهمى', paid: false, amount: 0 },
    { id: '32', name: 'شقة 82/ لواء / احمد ممتاز', paid: false, amount: 0 },
    { id: '33', name: 'شقة 83/ دكتور /فهمى  ابو غدير', paid: false, amount: 0 },
    { id: '34', name: 'شقة 84/دكتور / اسماء  ', paid: false, amount: 0 },
    { id: '35', name: 'شقة 91 /دكتور / ريم الدسوقى', paid: false, amount: 0 },
    { id: '36', name: 'شقة 92 / م/ علاء عبدالحافظ', paid: false, amount: 0 },
    { id: '37', name: 'شقة 93 / م/ هشام فضل ', paid: false, amount: 0 },
    { id: '38', name: 'شقة 94 / لواء / عادل عدلى', paid: false, amount: 0 }
  
  ]);

  const contentRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (id: string, type: 'income' | 'expense', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. الحد الأقصى هو 5 ميجابايت');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      if (type === 'income') {
        setIncomeEntries(entries =>
          entries.map(entry =>
            entry.id === id ? { ...entry, image: base64String } : entry
          )
        );
      } else {
        setExpenseEntries(entries =>
          entries.map(entry =>
            entry.id === id ? { ...entry, image: base64String } : entry
          )
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const updateApartmentPayment = (id: string, field: 'paid' | 'amount', value: boolean | number) => {
    setApartmentPayments(apartmentPayments.map(payment =>
      payment.id === id ? { ...payment, [field]: value } : payment
    ));
  };

  const addEntry = (type: 'income' | 'expense') => {
    const newEntry = { id: Date.now().toString(), description: '', amount: 0 };
    if (type === 'income') {
      setIncomeEntries([...incomeEntries, newEntry]);
    } else {
      setExpenseEntries([...expenseEntries, newEntry]);
    }
  };

  const removeEntry = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncomeEntries(incomeEntries.filter(entry => entry.id !== id));
    } else {
      setExpenseEntries(expenseEntries.filter(entry => entry.id !== id));
    }
  };

  const updateEntry = (
    id: string,
    field: 'description' | 'amount',
    value: string | number,
    type: 'income' | 'expense'
  ) => {
    const updateEntries = (entries: FinancialEntry[]) =>
      entries.map(entry =>
        entry.id === id ? { ...entry, [field]: value } : entry
      );

    if (type === 'income') {
      setIncomeEntries(updateEntries(incomeEntries));
    } else {
      setExpenseEntries(updateEntries(expenseEntries));
    }
  };

  const totalApartmentPayments = apartmentPayments.reduce(
    (sum, payment) => sum + (payment.paid ? payment.amount : 0),
    0
  );

  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0) + totalApartmentPayments;
  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const netBalance = startBalance + totalIncome - totalExpenses;

  const generatePDF = () => {
    if (contentRef.current) {
      html2canvas(contentRef.current, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
  
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
  
        // Add additional pages
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
  
        pdf.save('الميزانية-المالية.pdf');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 text-right print:text-center print:p-0 print:bg-white" dir="rtl">
      <div
        ref={contentRef}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 print:shadow-none"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          ميزانية صندوق عمارة 32 عمارات الاخاء 
          <p className="text-lg sm:text-xl mt-1">(عمارات الشرطة)</p>
        </h1>

        {/* فترة الحساب */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 print:text-center">فترة الحساب</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 print:text-center">من تاريخ:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-md print:text-center"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1 print:text-center">حتى تاريخ:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-md print:text-center"
              />
            </div>
          </div>
        </div>

        {/* رصيد بداية العام */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-700 print:text-center">
            رصيد بداية الفترة
          </h2>
          <input
            type="number"
            value={startBalance}
            onChange={(e) => setStartBalance(Number(e.target.value))}
            className="w-full p-2 border rounded-md print:text-center"
            placeholder="أدخل الرصيد الافتتاحي"
          />
        </div>

        {/* جدول الشقق */}
        <div className="mb-6 sm:mb-8 print:break-inside-avoid">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 print:text-center"> اشتراكات الشقق فى الصيانة الشهرية</h2>

          {/* جدول الشقق */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {apartmentPayments.map((payment) => (
              <div
                key={payment.id}
                className={`p-4 border rounded-lg ${
                  payment.paid ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{payment.name}</span>
                  <button
                    onClick={() => updateApartmentPayment(payment.id, 'paid', !payment.paid)}
                    className={`p-1 rounded-full ${
                      payment.paid
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    } print:hidden`}
                  >
                    {payment.paid ? <Check size={16} /> : <X size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 print:text-center">المبلغ المدفوع:</label>
                  <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) => updateApartmentPayment(payment.id, 'amount', Number(e.target.value))}
                    className="w-full p-2 border rounded-md bg-white print:text-center"
                    placeholder="المبلغ"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {payment.amount} جنيه
                  {payment.paid && <span className="text-green-600 block">تم الدفع</span>}
                </div>
              </div>
            ))}
          </div>

          {/* إجمالي دفعات الشقق */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold flex justify-between print:flex-col print:text-center print:gap-1">
              <span>إجمالي الاشتراكات الشهرية للشقق:</span>
              <span className="text-green-600">{totalApartmentPayments} جنيه</span>
            </div>
          </div>
        </div>

        {/* قسم الدخل */}
        <div className="mb-6 sm:mb-8 print:break-inside-avoid">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 print:text-center">دخل إضافي</h2>
          {incomeEntries.map((entry) => (
            <div key={entry.id} className="mb-4 sm:mb-6 border rounded-lg p-3 sm:p-4 bg-gray-50 print:break-inside-avoid">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-2">
                <input
                  type="text"
                  value={entry.description}
                  onChange={(e) =>
                    updateEntry(entry.id, 'description', e.target.value, 'income')
                  }
                  className="flex-1 p-2 border rounded-md bg-white print:text-center"
                  placeholder="وصف الدخل"
                />
                <input
                  type="number"
                  value={entry.amount}
                  onChange={(e) =>
                    updateEntry(entry.id, 'amount', Number(e.target.value), 'income')
                  }
                  className="w-full sm:w-48 p-2 border rounded-md bg-white print:text-center"
                  placeholder="المبلغ"
                />
                <button
                  onClick={() => removeEntry(entry.id, 'income')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md bg-white print:hidden"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="mt-2 print:break-inside-avoid">
                <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-white border rounded-md hover:bg-gray-50 print:hidden">
                  <Image size={20} className="text-gray-600" />
                  <span className="text-sm text-gray-600">إرفاق صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(entry.id, 'income', e)}
                    className="hidden"
                  />
                </label>
                {entry.image && (
                  <div className="mt-2 print:flex print:justify-center">
                    <img
                      src={entry.image}
                      alt="المرفق"
                      className="max-h-32 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={() => addEntry('income')}
            className="flex items-center gap-2 text-green-600 hover:bg-green-50 p-2 rounded-md print:hidden"
          >
            <Plus size={20} />
            <span>إضافة دخل جديد</span>
          </button>
        </div>

        {/* قسم المصروفات */}
        <div className="mb-6 sm:mb-8 print:break-inside-avoid">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 print:text-center">المصروفات</h2>
          {expenseEntries.map((entry) => (
            <div key={entry.id} className="mb-4 sm:mb-6 border rounded-lg p-3 sm:p-4 bg-gray-50 print:break-inside-avoid">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-2">
                <input
                  type="text"
                  value={entry.description}
                  onChange={(e) =>
                    updateEntry(entry.id, 'description', e.target.value, 'expense')
                  }
                  className="flex-1 p-2 border rounded-md bg-white print:text-center"
                  placeholder="وصف المصروف"
                />
                <input
                  type="number"
                  value={entry.amount}
                  onChange={(e) =>
                    updateEntry(entry.id, 'amount', Number(e.target.value), 'expense')
                  }
                  className="w-full sm:w-48 p-2 border rounded-md bg-white print:text-center"
                  placeholder="المبلغ"
                />
                <button
                  onClick={() => removeEntry(entry.id, 'expense')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md bg-white print:hidden"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="mt-2 print:break-inside-avoid">
                <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-white border rounded-md hover:bg-gray-50 print:hidden">
                  <Image size={20} className="text-gray-600" />
                  <span className="text-sm text-gray-600">إرفاق صورة</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(entry.id, 'expense', e)}
                    className="hidden"
                  />
                </label>
                {entry.image && (
                  <div className="mt-2 print:flex print:justify-center">
                    <img
                      src={entry.image}
                      alt="المرفق"
                      className="max-h-32 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button
            onClick={() => addEntry('expense')}
            className="flex items-center gap-2 text-green-600 hover:bg-green-50 p-2 rounded-md print:hidden"
          >
            <Plus size={20} />
            <span>إضافة مصروف جديد</span>
          </button>
        </div>

        {/* الإجماليات */}
        <div className="border-t pt-4 sm:pt-6 space-y-3 sm:space-y-4 print:break-inside-avoid">
          <div className="flex justify-between text-base sm:text-lg print:flex-col print:text-center print:gap-1">
            <span className="font-semibold">إجمالي الدخل:</span>
            <span className="text-green-600">{totalIncome} جنيه</span>
          </div>
          <div className="flex justify-between text-base sm:text-lg print:flex-col print:text-center print:gap-1">
            <span className="font-semibold">إجمالي المصروفات:</span>
            <span className="text-red-600">{totalExpenses} جنيه</span>
          </div>
          <div className="flex justify-between text-lg sm:text-xl font-bold print:flex-col print:text-center print:gap-1">
            <span>صافي الرصيد:</span>
            <span className={netBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
              {netBalance} جنيه
            </span>
          </div>
        </div>

        {/* قسم الملاحظات */}
        <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6 print:break-inside-avoid">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 print:text-center">ملاحظات</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 border rounded-md min-h-[120px] resize-y print:text-center"
            placeholder="أضف ملاحظاتك هنا..."
          />
        </div>
      </div>

      {/* زر تحميل PDF */}
      <div className="max-w-4xl mx-auto mt-4 sm:mt-6 flex justify-center print:hidden">
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileDown size={20} />
          <span>تحميل كملف PDF</span>
        </button>
      </div>
    </div>
  );
}

export default App;
