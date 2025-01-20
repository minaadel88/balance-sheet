import React, { useState, useRef } from 'react';
import { usePDF } from 'react-to-pdf';
import { FileDown, Plus, Trash2, Image } from 'lucide-react';

interface FinancialEntry {
  id: string;
  description: string;
  amount: number;
  image?: string;
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

  const { toPDF, targetRef } = usePDF({
    filename: 'الميزانية-المالية.pdf',
    page: { format: 'a4' },
    method: 'save',
    resolution: 2,
    page_breaks: true,
    targetRef: null,
    options: {
      margin: [15, 15, 15, 15],
      image: { type: 'jpeg', quality: 0.98 }
    }
  });

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

  const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const netBalance = startBalance + totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 text-right print:text-center print:p-0 print:bg-white" dir="rtl">
      <div
        ref={targetRef}
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

        {/* قسم الدخل */}
        <div className="mb-6 sm:mb-8 print:break-inside-avoid">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 print:text-center">الدخل</h2>
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
          onClick={() => toPDF()}
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
