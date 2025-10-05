import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Mail, Search, MessageSquare, Send, Archive, Eye, Filter, Clock } from 'lucide-react'
import { contactAPI } from '../../lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Badge } from '../../components/ui/badge'
import Layout from '../../components/Layout'

const MessagesPage = () => {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [statusCounts, setStatusCounts] = useState({})

  useEffect(() => {
    fetchMessages()
  }, [filterStatus])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const params = filterStatus !== 'all' ? { status: filterStatus } : {}
      const response = await contactAPI.getAll(params)
      
      if (response.data.success) {
        setMessages(response.data.data.messages)
        
        // Convert status counts array to object
        const counts = {}
        response.data.data.statusCounts.forEach(item => {
          counts[item._id] = item.count
        })
        setStatusCounts(counts)
      }
    } catch (err) {
      setError('Failed to load messages')
      console.error('Fetch messages error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMessage = async (message) => {
    try {
      // Fetch full message details
      const response = await contactAPI.getById(message._id)
      if (response.data.success) {
        setSelectedMessage(response.data.data.message)
        setReplyText('')
      }
    } catch (err) {
      console.error('Failed to load message details:', err)
    }
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return

    const toastId = toast.loading('Sending reply...')
    
    try {
      setSendingReply(true)
      const response = await contactAPI.reply(selectedMessage._id, { reply: replyText })
      
      if (response.data.success) {
        setSelectedMessage(response.data.data.message)
        setReplyText('')
        fetchMessages() // Refresh the list
        toast.success('Reply sent successfully! Email delivered to ' + selectedMessage.email, {
          id: toastId,
          duration: 4000,
        })
      }
    } catch (err) {
      console.error('Send reply error:', err)
      toast.error(err.response?.data?.message || 'Failed to send reply. Please try again.', {
        id: toastId,
      })
    } finally {
      setSendingReply(false)
    }
  }

  const handleUpdateStatus = async (messageId, newStatus) => {
    try {
      await contactAPI.updateStatus(messageId, newStatus)
      fetchMessages()
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus })
      }
      toast.success(`Status updated to ${newStatus}`)
    } catch (err) {
      console.error('Update status error:', err)
      toast.error('Failed to update status')
    }
  }

  const handleArchiveMessage = async (messageId) => {
    if (!confirm('Are you sure you want to archive this message?')) return
    
    const toastId = toast.loading('Archiving message...')
    
    try {
      await contactAPI.delete(messageId)
      fetchMessages()
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage(null)
      }
      toast.success('Message archived successfully', {
        id: toastId,
        icon: '🗃️',
      })
    } catch (err) {
      console.error('Archive message error:', err)
      toast.error('Failed to archive message', {
        id: toastId,
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'read': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'replied': return 'bg-green-100 text-green-800 border-green-200'
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Mail className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Contact Messages
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and respond to customer inquiries
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
            <Card className={`cursor-pointer ${filterStatus === 'all' ? 'ring-2 ring-primary' : ''}`} onClick={() => setFilterStatus('all')}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">All Messages</p>
                    <p className="text-2xl font-bold">{messages.length}</p>
                  </div>
                  <Mail className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${filterStatus === 'new' ? 'ring-2 ring-primary' : ''}`} onClick={() => setFilterStatus('new')}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">New</p>
                    <p className="text-2xl font-bold text-blue-600">{statusCounts['new'] || 0}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${filterStatus === 'read' ? 'ring-2 ring-primary' : ''}`} onClick={() => setFilterStatus('read')}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Read</p>
                    <p className="text-2xl font-bold text-yellow-600">{statusCounts['read'] || 0}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>
            <Card className={`cursor-pointer ${filterStatus === 'replied' ? 'ring-2 ring-primary' : ''}`} onClick={() => setFilterStatus('replied')}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Replied</p>
                    <p className="text-2xl font-bold text-green-600">{statusCounts['replied'] || 0}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredMessages.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No messages found</p>
                      </div>
                    ) : (
                      filteredMessages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                            selectedMessage?._id === msg._id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleSelectMessage(msg)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{msg.name}</p>
                              <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                              <p className="text-sm text-gray-700 mt-1 truncate">{msg.subject}</p>
                            </div>
                            <Badge className={`ml-2 text-xs ${getStatusColor(msg.status)}`}>
                              {msg.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Details & Reply */}
            <div className="lg:col-span-2">
              {!selectedMessage ? (
                <Card>
                  <CardContent className="p-12 text-center text-gray-500">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>Select a message to view details and reply</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedMessage.subject}</CardTitle>
                        <CardDescription>
                          From: {selectedMessage.name} ({selectedMessage.email})
                          {selectedMessage.phone && ` • Phone: ${selectedMessage.phone}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(selectedMessage.status)}>
                          {selectedMessage.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleArchiveMessage(selectedMessage._id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Original Message */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Previous Replies */}
                    {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Previous Replies</h4>
                        <div className="space-y-3">
                          {selectedMessage.replies.map((reply, index) => (
                            <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                By {reply.repliedBy?.name || 'Admin'} • {new Date(reply.repliedAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reply Form */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Send Reply</h4>
                      <Textarea
                        placeholder="Type your reply here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={5}
                        className="mb-3"
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Reply will be sent to {selectedMessage.email}
                        </p>
                        <Button
                          onClick={handleSendReply}
                          disabled={!replyText.trim() || sendingReply}
                        >
                          {sendingReply ? (
                            <>Sending...</>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reply
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default MessagesPage
