import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { 
  Home, 
  Plus, 
  Target, 
  Repeat, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  PiggyBank,
  BarChart3
} from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])
  const [recurrences, setRecurrences] = useState([])
  const [budgets, setBudgets] = useState([])

  // Categorias predefinidas
  const categories = [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 
    'Entretenimento', 'Roupas', 'Investimentos', 'Salário', 'Freelance', 'Outros'
  ]

  // Carregar dados do localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('meufluxo_transactions')
    const savedGoals = localStorage.getItem('meufluxo_goals')
    const savedRecurrences = localStorage.getItem('meufluxo_recurrences')
    const savedBudgets = localStorage.getItem('meufluxo_budgets')

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
      console.log('Transactions loaded:', JSON.parse(savedTransactions))
    } else {
      setTransactions([])
      console.log('No transactions found, initializing empty array.')
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
      console.log('Goals loaded:', JSON.parse(savedGoals))
    } else {
      setGoals([])
      console.log('No goals found, initializing empty array.')
    }
    if (savedRecurrences) {
      setRecurrences(JSON.parse(savedRecurrences))
      console.log('Recurrences loaded:', JSON.parse(savedRecurrences))
    } else {
      setRecurrences([])
      console.log('No recurrences found, initializing empty array.')
    }
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets))
      console.log('Budgets loaded:', JSON.parse(savedBudgets))
    } else {
      setBudgets([])
      console.log('No budgets found, initializing empty array.')
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem(\'meufluxo_transactions\', JSON.stringify(transactions))
    console.log(\'Transactions saved:\', transactions)
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(\'meufluxo_goals\', JSON.stringify(goals))
    console.log(\'Goals saved:\', goals)
  }, [goals])

  useEffect(() => {
    localStorage.setItem(\'meufluxo_recurrences\', JSON.stringify(recurrences))
    console.log(\'Recurrences saved:\', recurrences)
  }, [recurrences])

  useEffect(() => {
    localStorage.setItem(\'meufluxo_budgets\', JSON.stringify(budgets))
    console.log(\'Budgets saved:\', budgets)
  }, [budgets])

  // Calcular saldo atual
  const currentBalance = transactions.reduce((acc, transaction) => {
    return transaction.type === 'entrada' ? acc + transaction.amount : acc - transaction.amount
  }, 0)

  // Calcular entradas e saídas do mês atual
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
  })

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'entrada')
    .reduce((acc, t) => acc + t.amount, 0)

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'saida')
    .reduce((acc, t) => acc + t.amount, 0)

  // Componente de navegação
  const Navigation = () => (
    <nav className="glass-card rounded-2xl p-4 mb-6">
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'transactions', label: 'Transações', icon: Plus },
          { id: 'goals', label: 'Metas', icon: Target },
          { id: 'recurrences', label: 'Recorrências', icon: Repeat },
          { id: 'budget', label: 'Planejamento', icon: PieChart },
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? "default" : "ghost"}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 ${
              activeTab === id 
                ? 'bg-accent-green text-black hover:bg-accent-green/90' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Icon size={18} />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  )

  // Componente Dashboard
  const Dashboard = () => {
    const currentBalance = transactions.reduce((sum, t) => {
      return t.type === 'entrada' ? sum + t.amount : sum - t.amount
    }, 0)

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyIncome = transactions
      .filter(t => {
        const date = new Date(t.date)
        return t.type === 'entrada' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpenses = transactions
      .filter(t => {
        const date = new Date(t.date)
        return t.type === 'saida' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear
      })
      .reduce((sum, t) => sum + t.amount, 0)

    // Dados para gráfico de pizza por categoria
    const expensesByCategory = transactions
      .filter(t => {
        const date = new Date(t.date)
        return t.type === 'saida' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})

    const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount
    }))

    // Cores para o gráfico de pizza
    const COLORS = ['#00ff88', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3']

    // Dados para gráfico de barras (últimos 6 meses)
    const getMonthlyData = () => {
      const data = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const month = date.getMonth()
        const year = date.getFullYear()
        
        const income = transactions
          .filter(t => {
            const tDate = new Date(t.date)
            return t.type === 'entrada' && 
                   tDate.getMonth() === month && 
                   tDate.getFullYear() === year
          })
          .reduce((sum, t) => sum + t.amount, 0)

        const expenses = transactions
          .filter(t => {
            const tDate = new Date(t.date)
            return t.type === 'saida' && 
                   tDate.getMonth() === month && 
                   tDate.getFullYear() === year
          })
          .reduce((sum, t) => sum + t.amount, 0)

        data.push({
          month: date.toLocaleDateString('pt-BR', { month: 'short' }),
          entradas: income,
          saidas: expenses
        })
      }
      return data
    }

    const barData = getMonthlyData()

    // Alertas de gastos excessivos
    const getSpendingAlerts = () => {
      const alerts = []
      
      // Verificar se gastos do mês ultrapassaram a renda
      if (monthlyExpenses > monthlyIncome && monthlyIncome > 0) {
        alerts.push({
          type: 'danger',
          message: `Gastos do mês (R$ ${monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) ultrapassaram a renda (R$ ${monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`
        })
      }

      // Verificar gastos por categoria vs planejamento
      budgets.forEach(budget => {
        const spent = Object.entries(expensesByCategory).find(([cat]) => cat === budget.category)?.[1] || 0
        if (spent > budget.monthlyLimit) {
          alerts.push({
            type: 'warning',
            message: `Limite de ${budget.category} ultrapassado: R$ ${spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / R$ ${budget.monthlyLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          })
        }
      })

      return alerts
    }

    const alerts = getSpendingAlerts()

    return (
      <div className="space-y-6 fade-in">
        {/* Alertas */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border ${alert.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card rounded-2xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-accent-green' : 'text-red-400'}`}>
                R$ {currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entradas do Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-green">
                R$ {monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card rounded-2xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saídas do Mês</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                R$ {monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza - Gastos por Categoria */}
          <Card className="glass-card rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="text-accent-green" size={20} />
                Gastos por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Nenhum gasto registrado este mês
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Barras - Evolução Mensal */}
          <Card className="glass-card rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-accent-green" size={20} />
                Evolução Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Bar dataKey="entradas" fill="#00ff88" name="Entradas" />
                  <Bar dataKey="saidas" fill="#ff6b6b" name="Saídas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Transações Recentes */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-accent-green" size={20} />
              Transações Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma transação cadastrada ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(-5).reverse().map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg glass-card glass-card-hover">
                    <div>
                      <p className="font-medium">{transaction.category}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </p>
                      {transaction.description && (
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                      )}
                    </div>
                    <div className={`font-bold ${transaction.type === 'entrada' ? 'text-accent-green' : 'text-red-400'}`}>
                      {transaction.type === 'entrada' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Componente de Transações
  const Transactions = () => {
    const [formData, setFormData] = useState({
      type: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (!formData.type || !formData.amount || !formData.category) {
        alert('Por favor, preencha todos os campos obrigatórios.')
        return
      }

      const newTransaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        id: Date.now()
      }

      setTransactions([...transactions, newTransaction])
      setFormData({
        type: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      })
    }

    const deleteTransaction = (id) => {
      setTransactions(transactions.filter(t => t.id !== id))
    }

    return (
      <div className="space-y-6 fade-in">
        {/* Formulário de Nova Transação */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="text-accent-green" size={20} />
              Nova Transação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="glass-card border-white/20">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="amount">Valor *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="glass-card border-white/20">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Observação</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição opcional da transação"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="glass-card border-white/20"
                />
              </div>

              <Button type="submit" className="w-full bg-accent-green text-black hover:bg-accent-green/90">
                Adicionar Transação
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Transações */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-accent-green" size={20} />
              Todas as Transações ({transactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma transação cadastrada ainda.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.slice().reverse().map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg glass-card glass-card-hover">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={transaction.type === 'entrada' ? 'default' : 'destructive'}>
                          {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                        </Badge>
                        <span className="font-medium">{transaction.category}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </div>
                      {transaction.description && (
                        <div className="text-sm text-muted-foreground mt-1">{transaction.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`font-bold text-lg ${
                        transaction.type === 'entrada' ? 'text-accent-green' : 'text-red-400'
                      }`}>
                        {transaction.type === 'entrada' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Componente de Metas Financeiras
  const Goals = () => {
    const [formData, setFormData] = useState({
      name: '',
      targetAmount: '',
      currentAmount: '',
      category: '',
      deadline: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (!formData.name || !formData.targetAmount || !formData.deadline) {
        alert('Por favor, preencha todos os campos obrigatórios.')
        return
      }

      const newGoal = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        id: Date.now()
      }

      setGoals([...goals, newGoal])
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        category: '',
        deadline: ''
      })
    }

    const updateGoalProgress = (goalId, amount) => {
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, currentAmount: Math.max(0, goal.currentAmount + parseFloat(amount)) }
          : goal
      ))
    }

    const deleteGoal = (id) => {
      setGoals(goals.filter(g => g.id !== id))
    }

    return (
      <div className="space-y-6 fade-in">
        {/* Formulário de Nova Meta */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-accent-green" size={20} />
              Nova Meta Financeira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goalName">Nome da Meta *</Label>
                  <Input
                    id="goalName"
                    placeholder="Ex: Viagem para Europa"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>

                <div>
                  <Label htmlFor="targetAmount">Valor Alvo *</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>

                <div>
                  <Label htmlFor="currentAmount">Valor Atual</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>

                <div>
                  <Label htmlFor="goalCategory">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="glass-card border-white/20">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="deadline">Prazo *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-accent-green text-black hover:bg-accent-green/90">
                Criar Meta
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Metas */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-accent-green" size={20} />
              Minhas Metas ({goals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma meta cadastrada ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => {
                  const progress = (goal.currentAmount / goal.targetAmount) * 100
                  const isCompleted = progress >= 100
                  const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <div key={goal.id} className="p-4 rounded-lg glass-card glass-card-hover">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{goal.name}</h3>
                          {goal.category && (
                            <Badge variant="outline" className="mt-1">{goal.category}</Badge>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                            {daysLeft > 0 ? ` (${daysLeft} dias restantes)` : ' (Vencido)'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCompleted && (
                            <CheckCircle className="text-accent-green" size={20} />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGoal(goal.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          <span>R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <Progress 
                          value={Math.min(progress, 100)} 
                          className="h-3"
                        />
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${isCompleted ? 'text-accent-green' : 'text-muted-foreground'}`}>
                            {progress.toFixed(1)}% concluído
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const amount = prompt('Quanto deseja adicionar à meta?')
                                if (amount && !isNaN(amount)) {
                                  updateGoalProgress(goal.id, amount)
                                }
                              }}
                              className="text-accent-green border-accent-green hover:bg-accent-green/10"
                            >
                              + Adicionar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const amount = prompt('Quanto deseja remover da meta?')
                                if (amount && !isNaN(amount)) {
                                  updateGoalProgress(goal.id, -amount)
                                }
                              }}
                              className="text-red-400 border-red-400 hover:bg-red-400/10"
                            >
                              - Remover
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Componente de Recorrências
  const Recurrences = () => {
    const [formData, setFormData] = useState({
      name: '',
      type: '',
      amount: '',
      frequency: 'monthly',
      dayOfMonth: '1',
      active: true
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (!formData.name || !formData.type || !formData.amount) {
        alert('Por favor, preencha todos os campos obrigatórios.')
        return
      }

      const newRecurrence = {
        ...formData,
        amount: parseFloat(formData.amount),
        dayOfMonth: parseInt(formData.dayOfMonth),
        id: Date.now()
      }

      setRecurrences([...recurrences, newRecurrence])
      setFormData({
        name: '',
        type: '',
        amount: '',
        frequency: 'monthly',
        dayOfMonth: '1',
        active: true
      })
    }

    const toggleRecurrence = (id) => {
      setRecurrences(recurrences.map(rec => 
        rec.id === id ? { ...rec, active: !rec.active } : rec
      ))
    }

    const deleteRecurrence = (id) => {
      setRecurrences(recurrences.filter(r => r.id !== id))
    }

    const processRecurrences = () => {
      const today = new Date()
      const currentDay = today.getDate()
      
      recurrences.forEach(rec => {
        if (rec.active && rec.dayOfMonth === currentDay) {
          const newTransaction = {
            type: rec.type,
            amount: rec.amount,
            category: rec.type === 'entrada' ? 'Salário' : 'Outros',
            date: today.toISOString().split('T')[0],
            description: `${rec.name} (Recorrente)`,
            id: Date.now() + Math.random()
          }
          setTransactions(prev => [...prev, newTransaction])
        }
      })
    }

    return (
      <div className="space-y-6 fade-in">
        {/* Formulário de Nova Recorrência */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="text-accent-green" size={20} />
              Nova Recorrência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recName">Nome *</Label>
                  <Input
                    id="recName"
                    placeholder="Ex: Aluguel, Salário, Netflix"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>

                <div>
                  <Label htmlFor="recType">Tipo *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger className="glass-card border-white/20">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="recAmount">Valor *</Label>
                  <Input
                    id="recAmount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>

                <div>
                  <Label htmlFor="recFrequency">Frequência</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({...formData, frequency: value})}>
                    <SelectTrigger className="glass-card border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="recDay">Dia do Mês (1-31)</Label>
                  <Input
                    id="recDay"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.dayOfMonth}
                    onChange={(e) => setFormData({...formData, dayOfMonth: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-accent-green text-black hover:bg-accent-green/90">
                Criar Recorrência
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Recorrências */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat className="text-accent-green" size={20} />
              Minhas Recorrências ({recurrences.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recurrences.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma recorrência cadastrada ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {recurrences.map((rec) => (
                  <div key={rec.id} className="p-4 rounded-lg glass-card glass-card-hover">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{rec.name}</h3>
                          <Badge variant={rec.type === 'entrada' ? 'default' : 'destructive'}>
                            {rec.type === 'entrada' ? 'Entrada' : 'Saída'}
                          </Badge>
                          <Badge variant={rec.active ? 'default' : 'secondary'}>
                            {rec.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Valor: R$ {rec.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                          <p>Frequência: {rec.frequency === 'monthly' ? 'Mensal' : rec.frequency === 'weekly' ? 'Semanal' : 'Anual'}</p>
                          <p>Dia do mês: {rec.dayOfMonth}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRecurrence(rec.id)}
                          className={rec.active ? 'text-yellow-400 border-yellow-400 hover:bg-yellow-400/10' : 'text-accent-green border-accent-green hover:bg-accent-green/10'}
                        >
                          {rec.active ? 'Pausar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRecurrence(rec.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          ✕
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botão para processar recorrências manualmente */}
        <Card className="glass-card rounded-2xl border-0">
          <CardContent className="pt-6">
            <Button 
              onClick={processRecurrences}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Processar Recorrências de Hoje
            </Button>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Clique para adicionar automaticamente as transações recorrentes do dia atual
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Componente de Planejamento Mensal
  const Budget = () => {
    const [formData, setFormData] = useState({
      category: '',
      monthlyLimit: ''
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      if (!formData.category || !formData.monthlyLimit) {
        alert('Por favor, preencha todos os campos.')
        return
      }

      const existingBudget = budgets.find(b => b.category === formData.category)
      if (existingBudget) {
        setBudgets(budgets.map(b => 
          b.category === formData.category 
            ? { ...b, monthlyLimit: parseFloat(formData.monthlyLimit) }
            : b
        ))
      } else {
        const newBudget = {
          category: formData.category,
          monthlyLimit: parseFloat(formData.monthlyLimit),
          id: Date.now()
        }
        setBudgets([...budgets, newBudget])
      }

      setFormData({
        category: '',
        monthlyLimit: ''
      })
    }

    const deleteBudget = (id) => {
      setBudgets(budgets.filter(b => b.id !== id))
    }

    // Calcular gastos por categoria no mês atual
    const getCurrentMonthSpending = (category) => {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      return transactions
        .filter(t => {
          const transactionDate = new Date(t.date)
          return t.type === 'saida' && 
                 t.category === category &&
                 transactionDate.getMonth() === currentMonth &&
                 transactionDate.getFullYear() === currentYear
        })
        .reduce((sum, t) => sum + t.amount, 0)
    }

    return (
      <div className="space-y-6 fade-in">
        {/* Formulário de Novo Planejamento */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="text-accent-green" size={20} />
              Definir Limite Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budgetCategory">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="glass-card border-white/20">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'Salário' && cat !== 'Freelance').map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="monthlyLimit">Limite Mensal *</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.monthlyLimit}
                    onChange={(e) => setFormData({...formData, monthlyLimit: e.target.value})}
                    className="glass-card border-white/20"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-accent-green text-black hover:bg-accent-green/90">
                Definir Limite
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Planejamentos */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="text-accent-green" size={20} />
              Planejamento Mensal ({budgets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {budgets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum limite definido ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const spent = getCurrentMonthSpending(budget.category)
                  const percentage = (spent / budget.monthlyLimit) * 100
                  const isOverBudget = spent > budget.monthlyLimit
                  const isNearLimit = percentage >= 80 && !isOverBudget
                  
                  return (
                    <div key={budget.id} className={`p-4 rounded-lg glass-card glass-card-hover ${isOverBudget ? 'border-red-500/50' : isNearLimit ? 'border-yellow-500/50' : ''}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{budget.category}</h3>
                            {isOverBudget && (
                              <Badge variant="destructive" className="animate-pulse">
                                Limite Ultrapassado!
                              </Badge>
                            )}
                            {isNearLimit && (
                              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                                Próximo do Limite
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Limite: R$ {budget.monthlyLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p className={isOverBudget ? 'text-red-400 font-medium' : ''}>
                              Gasto: R$ {spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBudget(budget.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          ✕
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className={`h-3 ${isOverBudget ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-yellow-500' : '[&>div]:bg-accent-green'}`}
                        />
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${isOverBudget ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                            {percentage.toFixed(1)}% utilizado
                          </span>
                          <span className="text-sm text-muted-foreground">
                            Restante: R$ {Math.max(0, budget.monthlyLimit - spent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {isOverBudget && (
                        <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <div className="flex items-center gap-2 text-red-400">
                            <AlertTriangle size={16} />
                            <span className="text-sm font-medium">
                              Você ultrapassou o limite em R$ {(spent - budget.monthlyLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      )}

                      {isNearLimit && (
                        <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <div className="flex items-center gap-2 text-yellow-400">
                            <AlertTriangle size={16} />
                            <span className="text-sm font-medium">
                              Atenção! Você está próximo do limite mensal.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo Geral */}
        <Card className="glass-card rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-accent-green" size={20} />
              Resumo do Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Planejado</p>
                <p className="text-2xl font-bold text-accent-green">
                  R$ {budgets.reduce((sum, b) => sum + b.monthlyLimit, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-2xl font-bold">
                  R$ {budgets.reduce((sum, b) => sum + getCurrentMonthSpending(b.category), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Saldo do Planejamento</p>
                <p className={`text-2xl font-bold ${budgets.reduce((sum, b) => sum + b.monthlyLimit, 0) - budgets.reduce((sum, b) => sum + getCurrentMonthSpending(b.category), 0) >= 0 ? 'text-accent-green' : 'text-red-400'}`}>
                  R$ {(budgets.reduce((sum, b) => sum + b.monthlyLimit, 0) - budgets.reduce((sum, b) => sum + getCurrentMonthSpending(b.category), 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="accent-green">Meu</span> Fluxo
          </h1>
          <p className="text-muted-foreground text-lg">
            Controle financeiro pessoal simples e eficiente
          </p>
        </header>

        {/* Navigation */}
        <Navigation />

        {/* Content */}
        <main>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <Transactions />}
          {activeTab === 'goals' && <Goals />}
          {activeTab === 'recurrences' && <Recurrences />}
          {activeTab === 'budget' && <Budget />}
        </main>
      </div>
    </div>
  )
}

export default App

