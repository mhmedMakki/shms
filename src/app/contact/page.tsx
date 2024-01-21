export default function ContactPage() {
  return (
    <section className='container mx-auto'>
      <h1>صفحة تواصل معنا</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='flex flex-col justify-center items-center'>
          <h2>العنوان</h2>
          <p>........</p>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <h2>البريد الإلكتروني</h2>
          <p>
            <a href='mailto:info@shmsagricultural.com'>
              <strong>info@shmsagricultural.com</strong>
            </a>
          </p>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <h2>الهاتف</h2>
          <p>
            <a href='tel:+974 6602 7723'>
              <strong>+974 6602 7723</strong>
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
