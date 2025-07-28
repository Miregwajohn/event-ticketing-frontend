import  Navbar  from '../component/common/Navbar'
import Footer  from '../component/common/Footer'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type ContactForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

export const Contact = () => {
  const { register, handleSubmit, reset } = useForm<ContactForm>()

  const onSubmit = async (data: ContactForm) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Message sent successfully!')
        reset()
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-blue-100 via-white to-pink-100 py-10">
        <div className="mx-auto max-w-6xl px-4 bg-base-300 rounded-md">
          <div className="grid items-center justify-items-center gap-x-4 gap-y-10 lg:grid-cols-2 py-16">
            {/* contact form */}
            <div className="flex items-center justify-center w-full">
              <div className="px-2 md:px-8 w-full">
                <p className="text-2xl font-bold text-base-content md:text-4xl">Get in touch</p>
                <p className="mt-4 text-lg text-gray-600">Our friendly team would love to hear from you.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                  <div className="grid w-full gap-y-4 md:gap-x-4 lg:grid-cols-2">
                    <div className="grid w-full gap-1.5">
                      <label htmlFor="first_name" className="text-sm font-medium text-gray-700">First Name</label>
                      <input
                        {...register('firstName')}
                        id="first_name"
                        placeholder="First Name"
                        className="input input-bordered w-full"
                      />
                    </div>
                    <div className="grid w-full gap-1.5">
                      <label htmlFor="last_name" className="text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        {...register('lastName')}
                        id="last_name"
                        placeholder="Last Name"
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                  <div className="grid w-full gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      {...register('email')}
                      id="email"
                      placeholder="Email"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      {...register('phone')}
                      id="phone"
                      placeholder="Phone number"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="grid w-full gap-1.5">
                    <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      {...register('message')}
                      id="message"
                      placeholder="Leave us a message"
                      className="textarea textarea-bordered w-full"
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="w-full btn btn-outline btn-primary">Send Message</button>
                </form>
              </div>
            </div>
            {/* Image */}
            <img
              alt="Contact us"
              className="hidden max-h-fit w-full rounded-lg object-cover lg:block"
              src="https://images.unsplash.com/photo-1615840287214-7ff58936c4cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&h=800&q=80"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
