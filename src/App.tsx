import React, { useState, useRef } from 'react';
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
    { id: '1', name: 'شقة 1/ أ/ احمد سليم', paid: false, amount: 0 },
    { id: '2', name: 'شقة 2/ لواء / محمد عثمان', paid: false, amount: 0 },
    { id: '3', name: 'شقة 11/ أ /عماد الدين ', paid: false, amount: 0 },
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
    { id: '34', name: 'شقة 84/دكتورة / اسماء  ', paid: false, amount: 0 },
    { id: '35', name: 'شقة 91 /دكتور / ريم الدسوقى', paid: false, amount: 0 },
    { id: '36', name: 'شقة 92 / م/ علاء عبدالحافظ', paid: false, amount: 0 },
    { id: '37', name: 'شقة 93 / م/ هشام فضل ', paid: false, amount: 0 },
    { id: '38', name: 'شقة 94 / لواء / عادل عدلى', paid: false, amount: 0 }
  ]);

  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

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
        setIncomeEntries((entries) =>
          entries.map((entry) => (entry.id === id ? { ...entry, image: base64String } : entry))
        );
      } else {
        setExpenseEntries((entries) =>
          entries.map((entry) => (entry.id === id ? { ...entry, image: base64String } : entry))
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const updateApartmentPayment = (id: string, field: 'paid' | 'amount', value: boolean | number) => {
    setApartmentPayments(
      apartmentPayments.map((payment) =>
        payment.id === id ? { ...payment, [field]: value } : payment
      )
    );
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
      setIncomeEntries(incomeEntries.filter((entry) => entry.id !== id));
    } else {
      setExpenseEntries(expenseEntries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (
    id: string,
    field: 'description' | 'amount',
    value: string | number,
    type: 'income' | 'expense'
  ) => {
    const updateEntries = (entries: FinancialEntry[]) =>
      entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry));
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

  const generatePDF = async () => {
    if (!contentRef.current) return;

    try {
      setIsPrinting(true);
      
      const printContent = contentRef.current.cloneNode(true) as HTMLElement;
      printContent.querySelectorAll('.print\\:hidden').forEach(el => el.remove());
      
      // Set fixed dimensions for better consistency
      printContent.style.width = '1024px';
      printContent.style.position = 'center';
      printContent.style.direction='rtl';
      document.body.appendChild(printContent);

      const canvas = await html2canvas(printContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        windowWidth: 1024,
        windowHeight: printContent.scrollHeight,
        onclone: (_document, element) => {
          // Additional cleanup in cloned element if needed
          element.style.transform = '';
          element.style.webkitTransform = '';
        }
      });

      document.body.removeChild(printContent);

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 30; // 20mm margins
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;
      let page = 1;

      // First page
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight, '', 'FAST');
      heightLeft -= (pageHeight - (margin * 2));

      // Add subsequent pages
      while (heightLeft > 0) {
        position = -(pageHeight * page) + margin; // Calculate position for next page
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= (pageHeight - (margin * 2));
        page++;
      }

      pdf.save('الميزانية-المالية.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        ref={contentRef} 
        className="max-w-[1024px] mx-auto bg-white p-6 sm:p-8 shadow-lg print:shadow-none print:p-4" 
        dir="rtl"
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800">
          ميزانية صندوق عمارة 32 عمارات الاخاء 
          <p className="text-lg sm:text-xl mt-1">(عمارات الشرطة)</p>
        </h1>

        {/* Period */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="print:w-full">
          <label className="block font-bold mb-2 text-gray-700 text-right">من تاريخ:</label>            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 print:border-none print:p-0"
            />
          </div>
          <div className="print:w-full">
            <label className="block font-bold mb-2 text-gray-700 text-right">حتى تاريخ:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 print:border-none print:p-0"
            />
          </div>
        </div>

        {/* Starting Balance */}
        <div className="mb-6">
          <label className="block font-bold mb-2 text-gray-700 text-right">رصيد بداية الفترة:</label>
          <input
            type="number"
            value={startBalance}
            onChange={(e) => setStartBalance(Number(e.target.value))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 print:border-none print:p-0"
            placeholder="أدخل الرصيد الافتتاحي"
          />
        </div>

        {/* Apartments Payments */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-right">اشتراكات الشقق في الصيانة الشهرية</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-3 text-center">الاسم  </th>
                  <th className="border p-3 text-center print:hidden">تم الدفع</th>
                  <th className="border p-3 text-center">المبلغ المدفوع</th>
                </tr>
              </thead>
              <tbody>
                {apartmentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="border p-3 text-center">{payment.name}</td>
                    <td className="border p-3 text-center print:hidden">
                      <button
                        onClick={() => updateApartmentPayment(payment.id, 'paid', !payment.paid)}
                        className={`p-1 rounded-full ${
                          payment.paid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {payment.paid ? '✓' : '✗'}
                      </button>
                    </td>
                    <td className="border p-3 text-center">
                      <div className="print:text-center">
                        {payment.amount > 0 ? payment.amount : '-'}
                      </div>
                      <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => updateApartmentPayment(payment.id, 'amount', Number(e.target.value))}
                        className="w-full p-2 border rounded-lg bg-white print:hidden"
                        placeholder="المبلغ"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-bold text-gray-700 text-right">
            إجمالي الاشتراكات الشهرية للشقق: {totalApartmentPayments} جنيه
          </p>
        </div>

        {/* Income Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-right">دخل إضافي</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-3 text-center">وصف الدخل</th>
                  <th className="border p-3 text-center">المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {incomeEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border p-3 text-center">
                      <div className="print:text-center">
                        {entry.description || '-'}
                      </div>
                      <input
                        type="text"
                        value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value, 'income')}
                        className="w-full p-2 border rounded-lg bg-white print:hidden"
                        placeholder="وصف الدخل"
                      />
                    </td>
                    <td className="border p-3 text-center">
                      <div className="print:text-center">
                        {entry.amount > 0 ? entry.amount : '-'}
                      </div>
                      <input
                        type="number"
                        value={entry.amount}
                        onChange={(e) => updateEntry(entry.id, 'amount', Number(e.target.value), 'income')}
                        className="w-full sm:w-48 p-2 border rounded-lg bg-white print:hidden"
                        placeholder="المبلغ"
                      />
                    </td>
                    <td className="border p-3 text-center print:hidden">
                      <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-white border rounded-md hover:bg-gray-50 print:hidden">
                        <i className="fas fa-image text-gray-600" style={{ fontSize: 20 }}></i>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => addEntry('income')}
            className="mt-2 text-green-600 hover:bg-green-50 p-2 rounded-lg print:hidden"
          >
            إضافة دخل جديد
          </button>
        </div>

        {/* Expenses Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-right">المصروفات</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-3 text-center">وصف المصروف</th>
                  <th className="border p-3 text-center">المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {expenseEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border p-3 text-center">
                      <div className="print:text-center">
                        {entry.description || '-'}
                      </div>
                      <input
                        type="text"
                        value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value, 'expense')}
                        className="w-full p-2 border rounded-lg bg-white print:hidden"
                        placeholder="وصف المصروف"
                      />
                    </td>
                    <td className="border p-3 text-center">
                      <div className="print:text-center">
                        {entry.amount > 0 ? entry.amount : '-'}
                      </div>
                      <input
                        type="number"
                        value={entry.amount}
                        onChange={(e) => updateEntry(entry.id, 'amount', Number(e.target.value), 'expense')}
                        className="w-full sm:w-48 p-2 border rounded-lg bg-white print:hidden"
                        placeholder="المبلغ"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={() => addEntry('expense')}
            className="mt-2 text-green-600 hover:bg-green-50 p-2 rounded-lg print:hidden"
          >
            إضافة مصروف جديد
          </button>
        </div>

        {/* Totals */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="font-bold text-gray-700 mb-2 text-right">إجمالي الدخل: {totalIncome} جنيه</p>
          <p className="font-bold text-gray-700 mb-2 text-right">إجمالي المصروفات: {totalExpenses} جنيه</p>
          <p className={`font-bold text-right" ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            صافي الرصيد: {netBalance} جنيه
          </p>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <label className="block font-bold mb-2 text-gray-700 text-right">ملاحظات:</label>
          <div className="print:text-center print:min-h-[100px] print:border print:p-4 print:rounded-lg text-right">
            {notes || 'لا توجد ملاحظات'}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 border rounded-lg min-h-[120px] resize-y print:hidden"
            placeholder="أضف ملاحظاتك هنا..."
          />
        </div>

        {/* Download PDF Button - Hidden in Print and PDF */}
        {!isPrinting && (
          <button
            onClick={generatePDF}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors print:hidden"
          >
            تحميل كملف PDF
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
