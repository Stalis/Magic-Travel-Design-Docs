# 0. Идеи

# Я БЛЯТЬ ПРИДУМАЛ

Я придумал, как можно сделать привязку через интерфейсы, но при этом распихивать объекты в редакторе:

```csharp
interface IInteractable
{
	void Interact();
}

class Zhopa : MonoBehaviour
{
		[SerializedField]
		private GameObject interactableObject;
		
		private IInteractable _interactable;
		
		void OnValidate() 
		{
				if (!interactableObject.TryGetComponent<IInteractable>(out _interactable))
				{
					Debug.Error($"Cannot get {nameof(IInteractable)} component from object {interactableObject.name}");
				}
		}
}
```

Костыльненько, лишние поля, ручная валидация, но должно работать