import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import mondaySdk from 'monday-sdk-js';

// Mock Data
const mockData = {
  regions: [
    { id: 'reg-1', name: 'North India' },
    { id: 'reg-2', name: 'South India' },
    { id: 'reg-3', name: 'West India' },
    { id: 'reg-4', name: 'East India' },
    { id: 'reg-5', name: 'Central India' }
  ],
  properties: [
    { id: 'prop-1', name: 'Chitrakoot Garden & Resorts', regionId: 'reg-1', location: 'Jaipur', email: 'info@chitrakootgardenandresorts.com', phone: '7726011300, 6350220728' },
    { id: 'prop-2', name: 'Oberoi Wildflower Hall', regionId: 'reg-1', location: 'Shimla', email: 'info@oberoi.com', phone: '1234567890' },
    { id: 'prop-3', name: 'The Lalit', regionId: 'reg-1', location: 'Chandigarh', email: 'info@lalit.com', phone: '9876543210' },
    { id: 'prop-4', name: 'Leela Palace', regionId: 'reg-2', location: 'Bangalore', email: 'info@leela.com', phone: '8765432109' },
    { id: 'prop-5', name: 'Taj Coromandel', regionId: 'reg-2', location: 'Chennai', email: 'info@taj.com', phone: '7654321098' },
    { id: 'prop-6', name: 'ITC Grand Chola', regionId: 'reg-2', location: 'Chennai', email: 'info@itc.com', phone: '6543210987' },
    { id: 'prop-7', name: 'Taj Lands End', regionId: 'reg-3', location: 'Mumbai', email: 'info@tajmumbai.com', phone: '5432109876' },
    { id: 'prop-8', name: 'ITC Grand Central', regionId: 'reg-3', location: 'Mumbai', email: 'info@itcmumbai.com', phone: '4321098765' },
    { id: 'prop-9', name: 'Marriott Resort', regionId: 'reg-3', location: 'Goa', email: 'info@marriott.com', phone: '3210987654' },
    { id: 'prop-10', name: 'Taj Bengal', regionId: 'reg-4', location: 'Kolkata', email: 'info@tajkolkata.com', phone: '2109876543' },
    { id: 'prop-11', name: 'Mayfair Lagoon', regionId: 'reg-4', location: 'Bhubaneswar', email: 'info@mayfair.com', phone: '1098765432' },
    { id: 'prop-12', name: 'Jehan Numa Palace', regionId: 'reg-5', location: 'Bhopal', email: 'info@jehannuma.com', phone: '0987654321' }
  ],
  rooms: [
    { id: 'room-1', name: 'Standard Room', price: 4500 },
    { id: 'room-2', name: 'Deluxe Room', price: 7500 },
    { id: 'room-3', name: 'Premium Suite', price: 12000 },
    { id: 'room-4', name: 'Executive Suite', price: 18000 },
    { id: 'room-5', name: 'Royal Suite', price: 25000 }
  ],
  mealPlans: [
    { id: 'meal-1', name: 'Room Only (EP)', price: 0 },
    { id: 'meal-2', name: 'Breakfast Only (CP)', price: 800 },
    { id: 'meal-3', name: 'Breakfast & Dinner (MAP)', price: 1800 },
    { id: 'meal-4', name: 'All Meals (AP)', price: 2800 }
  ]
};

// Monday.com Configuration
const MONDAY_API_URL = 'https://api.monday.com/v2';
const MONDAY_FILE_URL = 'https://api.monday.com/v2/file';
const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjU4OTUwNDc1MywiYWFpIjoxMSwidWlkIjo5NjYxNjc5OSwiaWFkIjoiMjAyNS0xMS0yMlQwNjoxMDoxOS41OTJaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MzI1NzMzNDIsInJnbiI6ImFwc2UyIn0.VPdRSYJv5ZAAw4S-ATgzauxoir1DnLeHOvllxDCGf_E";
const BOOKINGS_BOARD_ID = 5025061726;
// const FILE_COLUMN_ID = 'file_mkxy94cc'; // Update with your file column ID
const FILE_COLUMN_ID = 'file_mkxy9dr0'; // Update with your file column ID
console.log("Filecolumnnnupdateddd");

const STATUS_COLUMN_ID = 'deal_stage'; // Update with your status column ID


const generateQuotePDF = (quote) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let y = 15;

  // Header with green background
  doc.setFillColor(34, 139, 34);
  doc.rect(margin, y, contentWidth, 25, 'F');
  
  // Logo area
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin + 5, y + 3, 50, 19, 2, 2, 'F');
  doc.setTextColor(34, 139, 34);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CHITRAKOOT', margin + 8, y + 12);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Garden & Resorts', margin + 8, y + 16);

  y += 30;

  // Company Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Company Name', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${quote.property}`, margin + 35, y);
  
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Company Email', margin, y);
  doc.setTextColor(0, 0, 255);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${quote.propertyEmail}`, margin + 35, y);
  
  y += 5;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Contact number', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`: ${quote.propertyPhone}`, margin + 35, y);

  y += 10;

  // PREPARED FOR header
  doc.setFillColor(51, 51, 51);
  doc.rect(margin, y, contentWidth * 0.6, 7, 'F');
  doc.rect(margin + contentWidth * 0.6, y, contentWidth * 0.4, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PREPARED FOR', margin + 3, y + 5);
  doc.text('PREPARED DATE', margin + contentWidth * 0.6 + 3, y + 5);

  y += 7;
  
  // Guest details box
  doc.setDrawColor(180, 180, 180);
  doc.rect(margin, y, contentWidth * 0.6, 35, 'S');
  doc.rect(margin + contentWidth * 0.6, y, contentWidth * 0.4, 35, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  let gy = y + 6;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Guest Name', margin + 3, gy);
  doc.setFont('helvetica', 'normal');
  doc.text(quote.guestName, margin + 32, gy);
  
  gy += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Reference by', margin + 3, gy);
  doc.setFont('helvetica', 'normal');
  doc.text('Direct', margin + 32, gy);
  
  gy += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('City', margin + 3, gy);
  doc.setFont('helvetica', 'normal');
  doc.text(quote.location, margin + 32, gy);
  
  gy += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Country', margin + 3, gy);
  doc.setFont('helvetica', 'normal');
  doc.text('India', margin + 32, gy);
  
  gy += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Contact person', margin + 3, gy);
  doc.setFont('helvetica', 'normal');
  doc.text(quote.guestName, margin + 32, gy);

  // Right side dates
  const rx = margin + contentWidth * 0.6 + 5;
  doc.text(quote.quoteDate, rx + 35, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.text(`Check/in date : ${quote.checkIn}`, rx, y + 15);
  doc.text(`Check/out date : ${quote.checkOut}`, rx, y + 25);

  y += 40;

  // Description Table Header
  doc.setFillColor(51, 51, 51);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  
  doc.text('DESCRIPTION', margin + 3, y + 5);
  doc.text('Night', margin + 85, y + 5);
  doc.text('Rooms', margin + 105, y + 5);
  doc.text('Price', margin + 130, y + 5);
  doc.text('TOTAL', margin + 155, y + 5);

  y += 7;
  
  // Table Row
  doc.setDrawColor(180, 180, 180);
  doc.rect(margin, y, contentWidth, 10, 'S');
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text(quote.room, margin + 3, y + 7);
  doc.text(String(quote.nights), margin + 88, y + 7);
  doc.text('1', margin + 112, y + 7);
  doc.text(String(quote.roomPrice), margin + 130, y + 7);
  doc.text(`${quote.roomTotal.toLocaleString()}/-`, margin + 152, y + 7);

  y += 15;

  // Notes & Amount Section
  doc.setFillColor(248, 248, 248);
  doc.rect(margin, y, contentWidth * 0.65, 85, 'F');
  doc.setDrawColor(180, 180, 180);
  doc.rect(margin + contentWidth * 0.65, y, contentWidth * 0.35, 85, 'S');

  // Left notes
  let ny = y + 6;
  doc.setFontSize(8);
  doc.setTextColor(34, 139, 34);
  doc.setFont('helvetica', 'italic');
  doc.text('Other facility : Gardens, playing area for kids,', margin + 3, ny);
  ny += 4;
  doc.text('Room service, restaurant, swimming pool.', margin + 3, ny);
  
  ny += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Note : ', margin + 3, ny);
  doc.setFont('helvetica', 'normal');
  doc.text(`This booking on ${quote.mealPlan} basis`, margin + 15, ny);
  
  ny += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('Accepted Payment : ', margin + 3, ny);
  doc.setFont('helvetica', 'normal');
  doc.text('Cash / UPI / Bank transfer.', margin + 38, ny);
  
  ny += 6;
  doc.setTextColor(255, 0, 0);
  doc.text('Note : 1. ALL due payment will be clear before check/in', margin + 3, ny);
  ny += 4;
  doc.text('or at time of check/in.', margin + 3, ny);
  
  ny += 5;
  doc.setTextColor(0, 0, 0);
  doc.text('2. Govt. id required ', margin + 3, ny);
  doc.setTextColor(34, 139, 34);
  doc.text('for all member who will stay.', margin + 32, ny);
  
  ny += 5;
  doc.setTextColor(255, 0, 0);
  doc.text('3. Advance amount non-refundable or non-adjustable', margin + 3, ny);
  
  ny += 5;
  doc.text('4. This booking for ', margin + 3, ny);
  doc.setTextColor(34, 139, 34);
  doc.text("1 room's.", margin + 32, ny);
  
  ny += 5;
  doc.setTextColor(0, 0, 0);
  doc.text('5. C/in time : ', margin + 3, ny);
  doc.setTextColor(255, 0, 0);
  doc.text('14:00', margin + 22, ny);
  doc.setTextColor(0, 0, 0);
  doc.text('  C/out time : ', margin + 32, ny);
  doc.setTextColor(255, 0, 0);
  doc.text('11:00', margin + 52, ny);

  // Right amounts
  const ax = margin + contentWidth * 0.65 + 5;
  let ay = y + 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Nett amount', ax, ay);
  doc.setFont('helvetica', 'normal');
  doc.text(`${quote.subtotal.toLocaleString()}/-`, ax + 40, ay);
  
  ay += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Advance received', ax, ay);
  doc.setFont('helvetica', 'normal');
  doc.text('0/-', ax + 40, ay);
  
  ay += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Sub total', ax, ay);
  doc.setFont('helvetica', 'normal');
  doc.text(`${quote.total.toLocaleString()}/-`, ax + 40, ay);

  // Disclaimer
  ay += 12;
  doc.setFillColor(255, 240, 240);
  doc.rect(ax - 2, ay, contentWidth * 0.35 - 6, 18, 'F');
  doc.setTextColor(255, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('This not an invoice only an', ax, ay + 5);
  doc.text('estimated quoted service.', ax, ay + 10);

  y += 90;

  // Footer
  doc.setFillColor(51, 51, 51);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Have any questions concerning this quote,', pageWidth / 2, y + 6, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.text('Contact : Saurabh sharma (Reservation Manager).', pageWidth / 2, y + 11, { align: 'center' });
  doc.text('Thank you for your business!', pageWidth / 2, y + 16, { align: 'center' });

  return doc;
};


const toBase64 = (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result.split(",")[1]);
  reader.onerror = reject;
  reader.readAsDataURL(blob);
});

const uploadPDFToMonday = async (pdfBlob, itemId, columnId) => {
  const form = new FormData();
  form.append("file", pdfBlob, "quote.pdf");  
  form.append("itemId", itemId);
  form.append("columnId", columnId);

  const response = await fetch("http://localhost:5000/api/upload", {
    method: "POST",
    body: form,
  });

  const data = await response.json();  // Fails if backend crashes
  return data;
};


// const uploadFileToMonday = async (itemId, file, filename) => {
//   const formData = new FormData();

//   const query = `
//     mutation add_file($file: File!, $itemId: ID!, $columnId: String!) {
//       add_file_to_column(item_id: $itemId, column_id: $columnId, file: $file) {
//         id
//       }
//     }
//   `;

//   formData.append("query", query);
//   formData.append("variables[itemId]", itemId);
//   formData.append("variables[columnId]", "file_mkxy9dr0");

//   // 👉 FIX: file must be a File object, not Blob
//   const fileObj = new File([file], filename, { type: "application/pdf" });

//   formData.append("variables[file]", fileObj);
//   formData.append("file", fileObj);

//   const response = await fetch("https://api.monday.com/v2/file", {
//     method: "POST",
//     headers: {
//       Authorization: API_TOKEN,
//     },
//     body: formData,
//   });

//   return response.json();
// };



const updateItemStatus = async (itemId, statusLabel = 'Quote Sent') => {
  try {
    // Simpler mutation using change_simple_column_value
    const query = `mutation {
      change_simple_column_value(
        board_id: ${BOOKINGS_BOARD_ID},
        item_id: ${itemId},
        column_id: "${STATUS_COLUMN_ID}",
        value: "${statusLabel}"
      ) {
        id
      }
    }`;

    console.log('Query:', query);

    const response = await fetch(MONDAY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_TOKEN
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    console.log('Result:', result);

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return result;
  } catch (error) {
    console.error('Status update error:', error);
    throw error;
  }
};

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b 0%, #1e3a5f 50%, #1e293b 100%)', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#fff' },
  header: { background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' },
  logo: { width: '40px', height: '40px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' },
  headerTitle: { margin: 0, fontSize: '20px' },
  headerSub: { margin: 0, fontSize: '12px', color: '#94a3b8' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '55px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: '55px' },
  card: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '30px', marginBottom: '16px' },
  sectionTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' },
  stepNum: { width: '24px', height: '24px', background: '#3b82f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' },
  input: { width: '100%', padding: '12px 14px', background: '#334155', border: '1px solid #475569', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '12px 14px', background: '#334155', border: '1px solid #475569', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' },
  nightsBadge: { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center', color: '#93c5fd', fontWeight: '500', marginTop: '16px' },
  btnPrimary: { flex: 1, padding: '14px 24px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  btnSecondary: { padding: '14px 24px', background: '#475569', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', cursor: 'pointer' },
  btnSuccess: { width: '100%', padding: '14px', background: '#22c55e', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '8px' },
  btnOutline: { width: '100%', padding: '12px', background: 'transparent', border: '1px solid #475569', borderRadius: '12px', color: '#fff', fontSize: '14px', cursor: 'pointer' },
  quoteHeader: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '12px', padding: '16px', marginBottom: '16px' },
  quoteSection: { background: 'rgba(51,65,85,0.5)', borderRadius: '12px', padding: '16px', marginBottom: '12px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '14px' },
  labelText: { color: '#94a3b8' },
  valueText: { color: '#fff' },
  divider: { borderTop: '1px solid #475569', margin: '8px 0' },
  total: { fontSize: '18px', fontWeight: 'bold' },
  totalAmount: { color: '#4ade80' },
  placeholder: { textAlign: 'center', padding: '60px 20px', color: '#64748b' },
  statusBadge: { fontSize: '11px', padding: '4px 10px', borderRadius: '20px', marginLeft: 'auto' },
  itemIdInput: { width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff', fontSize: '13px', marginBottom: '12px', boxSizing: 'border-box' }
};

export default function HotelBooking() {
  const [formData, setFormData] = useState({
    region: '', property: '', room: '', mealPlan: '',
    checkIn: '', checkOut: '', nights: 0,
    guestName: '', guestEmail: '', guestPhone: '',
    adults: 2, children: 0
  });
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [quote, setQuote] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mondayItemId, setMondayItemId] = useState('');
  const [error, setError] = useState('');
  const [itemId, setItemId] = useState('');
  console.log('setmondayid',mondayItemId);

  const monday = mondaySdk();

   useEffect(() => {
      monday.get("context").then((res) => {
        const context = res.data;
        console.log('context',context)
        if ("boardId" in context && "itemId" in context) {
            const boardId = Number(context.boardId);
            const itemId = Number(context.itemId);

            console.log("Board ID:", boardId);
            console.log("Item ID:", itemId);
            setMondayItemId(itemId);
        } else {
          console.warn("Board ID or Item ID not available in this context:", context);
        }
      });
  }, []);
  
  
  useEffect(() => {
    if (formData.region) {
      setFilteredProperties(mockData.properties.filter(p => p.regionId === formData.region));
      setFormData(prev => ({ ...prev, property: '' }));
    } else {
      setFilteredProperties([]);
    }
  }, [formData.region]);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      const diff = Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / 86400000);
      setFormData(prev => ({ ...prev, nights: diff > 0 ? diff : 0 }));
    }
  }, [formData.checkIn, formData.checkOut]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setQuote(null);
    setBookingStatus('');
    setError('');
  };

  const generateQuote = () => {
    const region = mockData.regions.find(r => r.id === formData.region);
    const property = filteredProperties.find(p => p.id === formData.property);
    const room = mockData.rooms.find(r => r.id === formData.room);
    const meal = mockData.mealPlans.find(m => m.id === formData.mealPlan);
    
    if (!region || !property || !room || !meal || formData.nights <= 0) return;
    
    const roomTotal = room.price * formData.nights;
    const mealTotal = meal.price * formData.nights;
    const subtotal = roomTotal + mealTotal;
    const gst = Math.round(subtotal * 0.18);
    
    setQuote({
      quoteNumber: `QT-${Date.now().toString().slice(-8)}`,
      quoteDate: new Date().toLocaleDateString('en-IN'),
      region: region.name, 
      property: property.name, 
      propertyEmail: property.email,
      propertyPhone: property.phone,
      location: property.location,
      room: room.name, roomPrice: room.price,
      mealPlan: meal.name, mealPrice: meal.price,
      ...formData, roomTotal, mealTotal, subtotal, gst, total: subtotal + gst
    });
    setBookingStatus('Quote Generated');
  };

  const downloadPDF = () => {
    if (!quote) return;
    const doc = generateQuotePDF(quote);
    doc.save(`Quote_${quote.guestName.replace(/\s+/g, '_')}_${quote.quoteDate.replace(/\//g, '-')}.pdf`);
  };

  const submitBooking = async () => {
  if (!quote) return;

  setIsSubmitting(true);
  setError('');

  try {
    // Generate PDF blob
    const doc = generateQuotePDF(quote);
    const pdfBlob = doc.output('blob');
    console.log("Blob test:", pdfBlob instanceof Blob, pdfBlob.type, pdfBlob.size);
    const filename = `Quote_${quote.guestName.replace(/\s+/g, '_')}_${quote.quoteDate.replace(/\//g, '-')}.pdf`;
    
    console.log('Generated PDF:', {
      filename,
      size: pdfBlob.size,
      type: pdfBlob.type
    });

    // Verify blob is valid
    if (pdfBlob.size === 0) {
      throw new Error('Generated PDF is empty');
    }

    // Upload PDF to Monday.com
    // const result = await uploadPDFToMonday(pdfBlob, setMondayItemId, "files");
    // console.log(result);
    
    // Update status to "Quote Sent"
    // const updateStatus = await updateItemStatus(2511604901, 'Quote Sent');
    // Upload PDF to Monday.com

// Upload PDF to Monday.com
console.log('Using mondayItemId:', mondayItemId);
const uploadResult = await uploadPDFToMonday(pdfBlob, mondayItemId, 'file_mkxy9dr0');
console.log('File upload successful:', uploadResult);

// Update status to "Quote Sent"
// const updateStatus = await updateItemStatus(mondayItemId, 'Quote Sent');

     const updateStatus = await updateItemStatus(mondayItemId, 'Quote Sent');
     console.log('Status update successfullllllllllllllllllllllllllllllll:', updateStatus);



    
    console.log('Status update successful:', updateStatus);

    setBookingStatus('Quote Sent');
    //alert(`✅ Success!\n\nPDF uploaded to Item ID: 2510690743\nStatus updated to "Quote Sent"`);

  } catch (err) {
    console.error('Submission error:', err);
    setError(`Failed: ${err.message}`);
    
    // Show more detailed error to user
    //alert(`❌ Error: ${err.message}\n\nCheck console for details.`);
  } finally {
    setIsSubmitting(false);
  }
};

  const resetForm = () => {
    setFormData({ region: '', property: '', room: '', mealPlan: '', checkIn: '', checkOut: '', nights: 0, guestName: '', guestEmail: '', guestPhone: '', adults: 2, children: 0 });
    setQuote(null);
    setBookingStatus('');
    setError('');
  };

  const isValid = formData.region && formData.property && formData.room && formData.mealPlan && formData.checkIn && formData.checkOut && formData.nights > 0 && formData.guestName;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>C</div>
        <div>
          <h1 style={styles.headerTitle}>Hotel Booking</h1>
          <p style={styles.headerSub}>Quote Management System</p>
        </div>
      </header>

      <main style={styles.main}>
        <div>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}><span style={styles.stepNum}>1</span>Select Your Stay</h2>
            <div style={styles.formGrid}>
              <div><label style={styles.label}>Region *</label><select name="region" value={formData.region} onChange={handleChange} style={styles.select}><option value="">-- Select Region --</option>{mockData.regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
              <div><label style={styles.label}>Property *</label><select name="property" value={formData.property} onChange={handleChange} style={{...styles.select, opacity: formData.region ? 1 : 0.5}} disabled={!formData.region}><option value="">-- Select Property --</option>{filteredProperties.map(p => <option key={p.id} value={p.id}>{p.name}, {p.location}</option>)}</select></div>
              <div><label style={styles.label}>Room Type *</label><select name="room" value={formData.room} onChange={handleChange} style={styles.select}><option value="">-- Select Room --</option>{mockData.rooms.map(r => <option key={r.id} value={r.id}>{r.name} - ₹{r.price.toLocaleString()}/night</option>)}</select></div>
              <div><label style={styles.label}>Meal Plan *</label><select name="mealPlan" value={formData.mealPlan} onChange={handleChange} style={styles.select}><option value="">-- Select Meal Plan --</option>{mockData.mealPlans.map(m => <option key={m.id} value={m.id}>{m.name} {m.price > 0 ? `- ₹${m.price}/night` : ''}</option>)}</select></div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}><span style={styles.stepNum}>2</span>Dates & Guests</h2>
            <div style={{...styles.formGrid, gridTemplateColumns: '1fr 1fr 1fr 1fr'}}>
              <div><label style={styles.label}>Check-In *</label><input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} min={today} style={styles.input}/></div>
              <div><label style={styles.label}>Check-Out *</label><input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} min={formData.checkIn || today} style={styles.input}/></div>
              <div><label style={styles.label}>Adults</label><select name="adults" value={formData.adults} onChange={handleChange} style={styles.select}>{[1,2,3,4].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
              <div><label style={styles.label}>Children</label><select name="children" value={formData.children} onChange={handleChange} style={styles.select}>{[0,1,2,3].map(n=><option key={n} value={n}>{n}</option>)}</select></div>
            </div>
            {formData.nights > 0 && <div style={styles.nightsBadge}>{formData.nights} Night{formData.nights > 1 ? 's' : ''} Stay</div>}
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}><span style={styles.stepNum}>3</span>Guest Information</h2>
            <div style={{...styles.formGrid, gridTemplateColumns: '1fr 1fr 1fr'}}>
              <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} placeholder="Full Name *" style={styles.input}/>
              <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} placeholder="Email Address" style={styles.input}/>
              <input type="tel" name="guestPhone" value={formData.guestPhone} onChange={handleChange} placeholder="Phone Number" style={styles.input}/>
            </div>
          </div>

          <div style={{display: 'flex', gap: '12px'}}>
            <button onClick={generateQuote} disabled={!isValid} style={{...styles.btnPrimary, opacity: isValid ? 1 : 0.4}}>Generate Quote</button>
            <button onClick={resetForm} style={styles.btnSecondary}>Reset</button>
          </div>
        </div>

        {/* Quote Preview */}
        <div>
          <div style={{...styles.card, position: 'sticky', top: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
              <h2 style={{...styles.sectionTitle, margin: 0}}>Quote Preview</h2>
              {bookingStatus && <span style={{...styles.statusBadge, background: bookingStatus === 'Quote Sent' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)', color: bookingStatus === 'Quote Sent' ? '#4ade80' : '#fbbf24'}}>{bookingStatus}</span>}
            </div>

            {quote ? (
              <>
                <div style={styles.quoteHeader}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', opacity: 0.9}}>
                    <span>{quote.quoteNumber}</span><span>{quote.quoteDate}</span>
                  </div>
                  <h3 style={{margin: 0, fontSize: '18px'}}>{quote.property}</h3>
                  <p style={{margin: '4px 0 0', fontSize: '13px', opacity: 0.85}}>{quote.location} • {quote.region}</p>
                </div>

                <div style={styles.quoteSection}>
                  <div style={styles.row}><span style={styles.labelText}>Guest</span><span style={styles.valueText}>{quote.guestName}</span></div>
                  <div style={styles.row}><span style={styles.labelText}>Room</span><span style={styles.valueText}>{quote.room}</span></div>
                  <div style={styles.row}><span style={styles.labelText}>Meal Plan</span><span style={styles.valueText}>{quote.mealPlan}</span></div>
                  <div style={styles.row}><span style={styles.labelText}>Check-In</span><span style={styles.valueText}>{quote.checkIn}</span></div>
                  <div style={styles.row}><span style={styles.labelText}>Check-Out</span><span style={styles.valueText}>{quote.checkOut}</span></div>
                  <div style={styles.row}><span style={styles.labelText}>Duration</span><span style={styles.valueText}>{quote.nights} Night{quote.nights > 1 ? 's' : ''}</span></div>
                </div>

                <div style={styles.quoteSection}>
                  <div style={{fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px'}}>Price Breakdown</div>
                  <div style={styles.row}><span style={styles.labelText}>Room (₹{quote.roomPrice.toLocaleString()} × {quote.nights})</span><span style={styles.valueText}>₹{quote.roomTotal.toLocaleString()}</span></div>
                  <div style={styles.row}><span style={styles.labelText}>Meals (₹{quote.mealPrice.toLocaleString()} × {quote.nights})</span><span style={styles.valueText}>₹{quote.mealTotal.toLocaleString()}</span></div>
                  <div style={styles.divider}/>
                  <div style={styles.row}><span style={styles.labelText}>Subtotal</span><span style={styles.valueText}>₹{quote.subtotal.toLocaleString()}</span></div>
                  <div style={styles.row}><span style={styles.labelText}>GST (18%)</span><span style={styles.valueText}>₹{quote.gst.toLocaleString()}</span></div>
                  <div style={styles.divider}/>
                  <div style={{...styles.row, ...styles.total}}><span>Total</span><span style={styles.totalAmount}>₹{quote.total.toLocaleString()}</span></div>
                </div>

                {/* Monday.com Item ID Input */}
                {/* <div style={{marginBottom: '12px'}}>
                  <label style={{...styles.label, marginBottom: '8px'}}>Monday.com Item ID *</label>
                  <input 
                    type="text" 
                    value={mondayItemId} 
                    onChange={(e) => setMondayItemId(e.target.value)}
                    placeholder="Enter Item ID to attach PDF"
                    style={styles.itemIdInput}
                  />
                </div> */}


                <button onClick={downloadPDF} style={styles.btnOutline}>
                  📥 Download PDF
                </button>
                
                <div style={{height: '10px'}}></div>

                <button onClick={submitBooking} disabled={isSubmitting || bookingStatus === 'Quote Sent'} style={{...styles.btnSuccess, opacity: (isSubmitting || bookingStatus === 'Quote Sent') ? 0.5 : 1}}>
                  {isSubmitting ? '⏳ Uploading PDF...' : bookingStatus === 'Quote Sent' ? '✓ Quote Sent' : '📤 Save'}
                </button>
                
                {bookingStatus === 'Quote Sent' && <p style={{fontSize: '12px', color: '#4ade80', textAlign: 'center', marginTop: '8px'}}>PDF attached • Status: "Quote Sent"</p>}
              </>
            ) : (
              <div style={styles.placeholder}>
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{opacity: 0.3, marginBottom: '12px'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p>Complete the form to generate a quote</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 
