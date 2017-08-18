def sum(n):
    if n==0:
        return 0
    return n + sum(n-1)
def fibonacci(n):
    if n==1:
        return 1
    elif n==2:
        return 1
    return fibonacci(n-1)+fibonacci(n-2)
def factorial(n):
    if n==0:
        return 1
    return n * factorial(n-1)
def decimal_to_binary(n):
    if n <= 1:
        return n
    return n % 2 + 10 * decimal_to_binary(n/2)

def TestRecursionFunction():
    print sum(100)
    print fibonacci(5)
    print factorial(10)
    print decimal_to_binary(15)

TestRecursionFunction()